'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { TypingDB } from './client';

type DBState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; db: TypingDB }
  | { status: 'error'; error: Error };

const DBContext = createContext<DBState>({ status: 'idle' });

export function TypingDBProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DBState>({ status: 'idle' });
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    setState({ status: 'loading' });

    (async () => {
      try {
        const { getDB } = await import('./client');
        const { migrateFromLocalStorageV1 } = await import('./migrations/from-localstorage-v1');
        const db = getDB();
        await db.init();
        await migrateFromLocalStorageV1(db as unknown as import('./client').TypingDB);
        setState({ status: 'ready', db: db as unknown as TypingDB });
      } catch (err) {
        console.error('[typing] DB init failed', err);
        setState({ status: 'error', error: err as Error });
      }
    })();
  }, []);

  return <DBContext.Provider value={state}>{children}</DBContext.Provider>;
}

export function useDBState(): DBState {
  return useContext(DBContext);
}

export function useDB(): TypingDB | null {
  const state = useDBState();
  return state.status === 'ready' ? state.db : null;
}
