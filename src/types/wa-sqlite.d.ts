/* Type stubs for wa-sqlite modules that ship without .d.ts */

declare module 'wa-sqlite/dist/wa-sqlite-async.mjs' {
  type EmscriptenModule = Record<string, unknown>;
  type FactoryOptions = { locateFile?: (file: string) => string };
  const factory: (opts?: FactoryOptions) => Promise<EmscriptenModule>;
  export default factory;
}

declare module 'wa-sqlite' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function Factory(module: any): any;
  export const SQLITE_ROW: number;
  export const SQLITE_DONE: number;
}

declare module 'wa-sqlite/src/examples/IDBBatchAtomicVFS.js' {
  type VFSOptions = {
    durability?: 'default' | 'strict' | 'relaxed';
    purge?: 'deferred' | 'manual';
    purgeAtLeast?: number;
  };
  export class IDBBatchAtomicVFS {
    constructor(name: string, options?: VFSOptions);
  }
}
