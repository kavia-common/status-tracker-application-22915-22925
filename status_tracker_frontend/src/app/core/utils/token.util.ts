import { isBrowser } from './platform.util';

const TOKEN_KEY = 'st_auth_token';
const USER_KEY = 'st_auth_user';

function storage(): any | undefined {
  if (!isBrowser) return undefined;
  const w = (globalThis as any).window as any;
  return w.localStorage as any;
}

export const TokenUtil = {
  saveToken(token: string) {
    const s = storage();
    if (!s) return;
    s.setItem(TOKEN_KEY, token);
  },
  getToken(): string | null {
    const s = storage();
    return s ? s.getItem(TOKEN_KEY) : null;
  },
  clearToken() {
    const s = storage();
    if (!s) return;
    s.removeItem(TOKEN_KEY);
  },
  saveUser(user: any) {
    const s = storage();
    if (!s) return;
    s.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser<T = any>(): T | null {
    const s = storage();
    if (!s) return null;
    const u = s.getItem(USER_KEY);
    return u ? (JSON.parse(u) as T) : null;
  },
  clearUser() {
    const s = storage();
    if (!s) return;
    s.removeItem(USER_KEY);
  },
  clearAll() {
    this.clearToken();
    this.clearUser();
  }
};
