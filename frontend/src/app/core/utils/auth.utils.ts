export const STORAGE_KEYS = {
  name: 'name',
  email: 'email',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

export function setStorageSession(
  name: string,
  email: string,
  accessToken: string,
  refreshToken: string,
): void {
  localStorage.setItem(STORAGE_KEYS.name, name);
  localStorage.setItem(STORAGE_KEYS.email, email);
  setStorageTokens(accessToken, refreshToken);
}

export function setStorageTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
}

export function clearStorageSession(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function getStorageItem(key: StorageKey): string {
  return localStorage.getItem(STORAGE_KEYS[key]) ?? '';
}
