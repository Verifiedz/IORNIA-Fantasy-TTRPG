export interface ContentError {
  file: string;
  message: string;
  field?: string;
}

export type ContentResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ContentError };

export function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
