import type { ContentError, ContentResult } from "./result";

export interface ContentCacheUpdate<T> {
  value: T | null;
  error: ContentError | null;
}

export interface ContentCache<T> {
  // Feeds a fresh parse result in. On success, stores and returns the new
  // value. On failure, the previous good value (if any) is kept and
  // returned alongside the error — a bad save on disk never blanks the app.
  update(file: string, result: ContentResult<T>): ContentCacheUpdate<T>;
  get(file: string): T | null;
}

export function createContentCache<T>(): ContentCache<T> {
  const lastGood = new Map<string, T>();

  return {
    update(file, result) {
      if (result.ok) {
        lastGood.set(file, result.value);
        return { value: result.value, error: null };
      }
      return { value: lastGood.get(file) ?? null, error: result.error };
    },
    get(file) {
      return lastGood.get(file) ?? null;
    },
  };
}
