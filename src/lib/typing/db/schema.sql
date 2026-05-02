PRAGMA journal_mode=MEMORY;

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
