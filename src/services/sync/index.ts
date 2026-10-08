// services/sync — слой синхронизации пользовательских данных (§4 новой доки).
// Локальное использование работает БЕЗ аккаунта (LocalSyncProvider).
// Удалённая синхронизация — отдельное расширение: достаточно реализовать
// SyncProvider (push/pull) и передать его в useAppStore, менять UI не нужно.

export interface UserDataSnapshot {
  favorites: string[];
  history: { siteId: string; openedAt: number }[];
  theme: string;
  customColors: { bg: string; surface: string; surface2: string; primary: string };
  onboarded: boolean;
  updatedAt: number;
}

export interface SyncProvider {
  readonly id: string;
  load(): Promise<Partial<UserDataSnapshot> | null>;
  save(patch: Partial<UserDataSnapshot>): Promise<void>;
  clear?(): Promise<void>;
}

const KEYS: Record<keyof Omit<UserDataSnapshot, 'updatedAt'>, string> = {
  favorites: 'anida:favorites',
  history: 'anida:history',
  theme: 'anida:theme',
  customColors: 'anida:custom-colors',
  onboarded: 'anida:onboarded',
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export class LocalSyncProvider implements SyncProvider {
  readonly id = 'local';
  async load(): Promise<Partial<UserDataSnapshot> | null> {
    return {
      favorites: read<string[]>(KEYS.favorites) ?? undefined,
      history: read<UserDataSnapshot['history']>(KEYS.history) ?? undefined,
      theme: read<string>(KEYS.theme) ?? undefined,
      customColors: read<UserDataSnapshot['customColors']>(KEYS.customColors) ?? undefined,
      onboarded: read<boolean>(KEYS.onboarded) ?? undefined,
    };
  }
  async save(patch: Partial<UserDataSnapshot>): Promise<void> {
    try {
      if (patch.favorites !== undefined) localStorage.setItem(KEYS.favorites, JSON.stringify(patch.favorites));
      if (patch.history !== undefined) localStorage.setItem(KEYS.history, JSON.stringify(patch.history));
      if (patch.theme !== undefined) localStorage.setItem(KEYS.theme, JSON.stringify(patch.theme));
      if (patch.customColors !== undefined)
        localStorage.setItem(KEYS.customColors, JSON.stringify(patch.customColors));
      if (patch.onboarded !== undefined) localStorage.setItem(KEYS.onboarded, JSON.stringify(patch.onboarded));
    } catch {}
  }
}

// Заглушка под будущий remote-синк (аккаунт/облако). Не блокирует запуск.
export class NoopRemoteSyncProvider implements SyncProvider {
  readonly id = 'remote-noop';
  async load() {
    return null;
  }
  async save() {}
}

export const defaultSyncProvider = new LocalSyncProvider();
