/// <reference lib="webworker" />
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Comlink from 'comlink';

// ─── Inline schema (mirrors schema.sql) ──────────────────────────────────────
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at INTEGER NOT NULL, finished_at INTEGER NOT NULL,
  mode TEXT NOT NULL, language TEXT NOT NULL, stage INTEGER NOT NULL,
  lesson_id TEXT, content_seed TEXT NOT NULL,
  jamo_typed INTEGER NOT NULL, jamo_correct INTEGER NOT NULL,
  tpm REAL NOT NULL, tpm_raw REAL NOT NULL,
  accuracy REAL NOT NULL, duration_seconds REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_mode_stage ON sessions(mode, stage, lesson_id);
CREATE INDEX IF NOT EXISTS idx_sessions_finished_at ON sessions(finished_at);

CREATE TABLE IF NOT EXISTS best_scores (
  config_key TEXT PRIMARY KEY,
  session_id INTEGER NOT NULL,
  tpm REAL NOT NULL, accuracy REAL NOT NULL, finished_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS key_stats (
  jamo TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  total_latency_ms INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS streak_days (
  date TEXT PRIMARY KEY,
  practice_seconds INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS game_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game TEXT NOT NULL, stage INTEGER NOT NULL,
  score INTEGER NOT NULL, wave INTEGER NOT NULL, combo_max INTEGER NOT NULL,
  finished_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_stage ON game_scores(game, stage, score DESC);
`;

// ─── SQLite instance ─────────────────────────────────────────────────────────
let sqlite3: any = null;
let db: any = null;
let initPromise: Promise<void> | null = null;

const SQLITE_ROW = 100;

// ─── IDB snapshot persistence ────────────────────────────────────────────────
const SNAPSHOT_DB_NAME = 'typing-snapshot';
const SNAPSHOT_STORE = 'snapshots';
const SNAPSHOT_KEY = 1;

type SnapshotData = Record<string, Record<string, unknown>[]>;

function openSnapshotIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(SNAPSHOT_DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(SNAPSHOT_STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function readSnapshot(): Promise<SnapshotData | null> {
  const idb = await openSnapshotIDB();
  try {
    return await new Promise<SnapshotData | null>((resolve, reject) => {
      const tx = idb.transaction(SNAPSHOT_STORE, 'readonly');
      const req = tx.objectStore(SNAPSHOT_STORE).get(SNAPSHOT_KEY);
      req.onsuccess = () => resolve((req.result?.data as SnapshotData) ?? null);
      req.onerror = () => reject(req.error);
    });
  } finally {
    idb.close();
  }
}

async function writeSnapshot(data: SnapshotData): Promise<void> {
  const idb = await openSnapshotIDB();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = idb.transaction(SNAPSHOT_STORE, 'readwrite');
      tx.objectStore(SNAPSHOT_STORE).put({ id: SNAPSHOT_KEY, data });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    idb.close();
  }
}

// Serialize ALL SQLite operations on the single connection. wa-sqlite-async
// uses Asyncify and is not safe for interleaved queries on one db handle.
let dbQueue: Promise<unknown> = Promise.resolve();
function withDbLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = dbQueue.then(fn);
  dbQueue = next.catch(() => {});
  return next;
}

let saveScheduled = false;
function scheduleSave(): void {
  if (saveScheduled) return;
  saveScheduled = true;
  withDbLock(async () => {
    saveScheduled = false;
    try {
      const data = await exportAllInternal();
      await writeSnapshot(data);
    } catch (e) {
      console.error('[typing] saveSnapshot failed', e);
    }
  });
}

async function loadSnapshot(): Promise<void> {
  let data: SnapshotData | null = null;
  try {
    data = await readSnapshot();
  } catch (e) {
    console.warn('[typing] loadSnapshot read failed', e);
    return;
  }
  if (!data) return;

  for (const row of data.settings ?? []) {
    await exec('INSERT OR REPLACE INTO settings(key,value) VALUES(?,?)',
      [row.key, row.value]);
  }
  for (const row of data.sessions ?? []) {
    await exec(
      `INSERT OR REPLACE INTO sessions(id,started_at,finished_at,mode,language,stage,lesson_id,content_seed,
        jamo_typed,jamo_correct,tpm,tpm_raw,accuracy,duration_seconds)
       VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [row.id, row.started_at, row.finished_at, row.mode, row.language, row.stage,
        row.lesson_id, row.content_seed, row.jamo_typed, row.jamo_correct,
        row.tpm, row.tpm_raw, row.accuracy, row.duration_seconds],
    );
  }
  for (const row of data.best_scores ?? []) {
    await exec(
      `INSERT OR REPLACE INTO best_scores(config_key,session_id,tpm,accuracy,finished_at)
       VALUES(?,?,?,?,?)`,
      [row.config_key, row.session_id, row.tpm, row.accuracy, row.finished_at],
    );
  }
  for (const row of data.key_stats ?? []) {
    await exec(
      `INSERT OR REPLACE INTO key_stats(jamo,attempts,correct,total_latency_ms) VALUES(?,?,?,?)`,
      [row.jamo, row.attempts, row.correct, row.total_latency_ms],
    );
  }
  for (const row of data.streak_days ?? []) {
    await exec('INSERT OR REPLACE INTO streak_days(date,practice_seconds) VALUES(?,?)',
      [row.date, row.practice_seconds]);
  }
  for (const row of data.game_scores ?? []) {
    await exec(
      `INSERT OR REPLACE INTO game_scores(id,game,stage,score,wave,combo_max,finished_at)
       VALUES(?,?,?,?,?,?,?)`,
      [row.id, row.game, row.stage, row.score, row.wave, row.combo_max, row.finished_at],
    );
  }

  // Restore AUTOINCREMENT counters so future inserts don't collide.
  await exec(
    `INSERT OR REPLACE INTO sqlite_sequence(name, seq)
     SELECT 'sessions', COALESCE(MAX(id), 0) FROM sessions`);
  await exec(
    `INSERT OR REPLACE INTO sqlite_sequence(name, seq)
     SELECT 'game_scores', COALESCE(MAX(id), 0) FROM game_scores`);
}

async function doInit() {
  const [{ default: SQLiteAsyncFactory }, SQLiteAPI, { MemoryAsyncVFS }] =
    await Promise.all([
      import('wa-sqlite/dist/wa-sqlite-async.mjs'),
      import('wa-sqlite'),
      import('wa-sqlite/src/examples/MemoryAsyncVFS.js'),
    ]);

  const sqliteModule = await SQLiteAsyncFactory({
    locateFile: (file: string) => `/typing/wasm/${file}`,
  });
  sqlite3 = SQLiteAPI.Factory(sqliteModule);

  const vfs = new MemoryAsyncVFS();
  await sqlite3.vfs_register(vfs, true);

  db = await sqlite3.open_v2('typing.db');
  await runStatements(SCHEMA_SQL);
  await loadSnapshot();
}

function ensureInit(): Promise<void> {
  if (!initPromise) initPromise = doInit();
  return initPromise;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function runStatements(sql: string): Promise<void> {
  for await (const stmt of sqlite3.statements(db, sql)) {
    await sqlite3.step(stmt);
  }
}

async function exec(sql: string, params: unknown[] = []): Promise<void> {
  for await (const stmt of sqlite3.statements(db, sql)) {
    if (params.length) sqlite3.bind_collection(stmt, params);
    await sqlite3.step(stmt);
  }
}

async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const rows: T[] = [];
  for await (const stmt of sqlite3.statements(db, sql)) {
    if (params.length) sqlite3.bind_collection(stmt, params);
    const cols: string[] = sqlite3.column_names(stmt);
    while ((await sqlite3.step(stmt)) === SQLITE_ROW) {
      const values: unknown[] = sqlite3.row(stmt);
      const row: Record<string, unknown> = {};
      cols.forEach((c, i) => (row[c] = values[i]));
      rows.push(row as T);
    }
  }
  return rows;
}

async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

async function lastInsertId(): Promise<number> {
  const r = await queryOne<{ id: number }>('SELECT last_insert_rowid() AS id');
  return r?.id ?? 0;
}

async function exportAllInternal(): Promise<SnapshotData> {
  // Sequential — concurrent queries on one wa-sqlite connection corrupt state.
  const settings = await query('SELECT * FROM settings');
  const sessions = await query('SELECT * FROM sessions ORDER BY id');
  const best_scores = await query('SELECT * FROM best_scores');
  const key_stats = await query('SELECT * FROM key_stats');
  const streak_days = await query('SELECT * FROM streak_days ORDER BY date');
  const game_scores = await query('SELECT * FROM game_scores ORDER BY id');
  return { settings, sessions, best_scores, key_stats, streak_days, game_scores };
}

// ─── Exposed API ─────────────────────────────────────────────────────────────
// All DB-touching methods run under withDbLock so SQLite operations on the single
// connection never interleave. Writes call scheduleSave() which queues a snapshot
// save behind the current lock holder.
const api = {
  async init() { await ensureInit(); },

  // Settings ─────────────────────────────────────────────────────────────────
  async getSetting(key: string): Promise<string | null> {
    await ensureInit();
    return withDbLock(async () => {
      const r = await queryOne<{ value: string }>('SELECT value FROM settings WHERE key=?', [key]);
      return r?.value ?? null;
    });
  },
  async setSetting(key: string, value: string): Promise<void> {
    await ensureInit();
    await withDbLock(async () => {
      await exec('INSERT OR REPLACE INTO settings(key,value) VALUES(?,?)', [key, value]);
    });
    scheduleSave();
  },

  // Sessions ─────────────────────────────────────────────────────────────────
  async insertSession(row: {
    started_at: number; finished_at: number; mode: string; language: string;
    stage: number; lesson_id: string | null; content_seed: string;
    jamo_typed: number; jamo_correct: number; tpm: number; tpm_raw: number;
    accuracy: number; duration_seconds: number;
  }): Promise<number> {
    await ensureInit();
    const id = await withDbLock(async () => {
      await exec(
        `INSERT INTO sessions(started_at,finished_at,mode,language,stage,lesson_id,content_seed,
          jamo_typed,jamo_correct,tpm,tpm_raw,accuracy,duration_seconds)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [row.started_at, row.finished_at, row.mode, row.language, row.stage, row.lesson_id,
         row.content_seed, row.jamo_typed, row.jamo_correct, row.tpm, row.tpm_raw,
         row.accuracy, row.duration_seconds],
      );
      return lastInsertId();
    });
    scheduleSave();
    return id;
  },
  async getRecentSessions(limit = 20): Promise<unknown[]> {
    await ensureInit();
    return withDbLock(() => query('SELECT * FROM sessions ORDER BY finished_at DESC LIMIT ?', [limit]));
  },

  // Best scores ──────────────────────────────────────────────────────────────
  async getBestScore(configKey: string): Promise<unknown | null> {
    await ensureInit();
    return withDbLock(() => queryOne('SELECT * FROM best_scores WHERE config_key=?', [configKey]));
  },
  async upsertBestScore(configKey: string, sessionId: number, tpm: number, accuracy: number, finishedAt: number): Promise<void> {
    await ensureInit();
    await withDbLock(() => exec(
      'INSERT OR REPLACE INTO best_scores(config_key,session_id,tpm,accuracy,finished_at) VALUES(?,?,?,?,?)',
      [configKey, sessionId, tpm, accuracy, finishedAt],
    ));
    scheduleSave();
  },
  async getAllBestScores(): Promise<unknown[]> {
    await ensureInit();
    return withDbLock(() => query('SELECT * FROM best_scores'));
  },

  // Key stats ────────────────────────────────────────────────────────────────
  async upsertKeyStats(jamo: string, attempts: number, correct: number, latencyMs: number): Promise<void> {
    await ensureInit();
    await withDbLock(() => exec(
      `INSERT INTO key_stats(jamo,attempts,correct,total_latency_ms) VALUES(?,?,?,?)
       ON CONFLICT(jamo) DO UPDATE SET
         attempts=attempts+excluded.attempts,
         correct=correct+excluded.correct,
         total_latency_ms=total_latency_ms+excluded.total_latency_ms`,
      [jamo, attempts, correct, latencyMs],
    ));
    scheduleSave();
  },
  async getAllKeyStats(): Promise<unknown[]> {
    await ensureInit();
    return withDbLock(() => query('SELECT * FROM key_stats ORDER BY attempts DESC'));
  },

  // Streak ───────────────────────────────────────────────────────────────────
  async recordStreak(date: string, practiceSeconds: number): Promise<void> {
    await ensureInit();
    await withDbLock(() => exec(
      `INSERT INTO streak_days(date,practice_seconds) VALUES(?,?)
       ON CONFLICT(date) DO UPDATE SET practice_seconds=practice_seconds+excluded.practice_seconds`,
      [date, practiceSeconds],
    ));
    scheduleSave();
  },
  async getStreakDays(fromDate: string, toDate: string): Promise<unknown[]> {
    await ensureInit();
    return withDbLock(() => query(
      'SELECT * FROM streak_days WHERE date BETWEEN ? AND ? ORDER BY date',
      [fromDate, toDate]));
  },

  // Game scores ──────────────────────────────────────────────────────────────
  async insertGameScore(row: {
    game: string; stage: number; score: number; wave: number; combo_max: number; finished_at: number;
  }): Promise<number> {
    await ensureInit();
    const id = await withDbLock(async () => {
      await exec(
        'INSERT INTO game_scores(game,stage,score,wave,combo_max,finished_at) VALUES(?,?,?,?,?,?)',
        [row.game, row.stage, row.score, row.wave, row.combo_max, row.finished_at],
      );
      return lastInsertId();
    });
    scheduleSave();
    return id;
  },
  async getTopGameScores(game: string, stage: number, limit = 10): Promise<unknown[]> {
    await ensureInit();
    return withDbLock(() => query(
      'SELECT * FROM game_scores WHERE game=? AND stage=? ORDER BY score DESC LIMIT ?',
      [game, stage, limit],
    ));
  },

  // Export / Import ──────────────────────────────────────────────────────────
  async exportAll(): Promise<Record<string, unknown[]>> {
    await ensureInit();
    return withDbLock(() => exportAllInternal());
  },
};

export type TypingDB = typeof api;

Comlink.expose(api);
