import * as Comlink from 'comlink';
import type { TypingDB } from './worker';

let _proxy: Comlink.Remote<TypingDB> | null = null;
let _worker: Worker | null = null;

export function getDB(): Comlink.Remote<TypingDB> {
  if (!_proxy) {
    _worker = new Worker(new URL('./worker.ts', import.meta.url));
    _proxy = Comlink.wrap<TypingDB>(_worker);
  }
  return _proxy;
}

export function terminateDB(): void {
  _worker?.terminate();
  _worker = null;
  _proxy = null;
}

export type { TypingDB };
