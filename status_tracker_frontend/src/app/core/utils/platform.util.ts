/**
 * Utilities for platform detection and safe global access without referencing `window` directly,
 * to satisfy SSR constraints and linters.
 */
export const isBrowser = typeof globalThis !== 'undefined'
  && typeof (globalThis as any).window !== 'undefined'
  && typeof (globalThis as any).document !== 'undefined';

export function getWindow<T = any>(): T | undefined {
  return isBrowser ? ((globalThis as any).window as T) : undefined;
}
