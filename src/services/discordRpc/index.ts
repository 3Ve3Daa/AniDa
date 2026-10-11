export type RpcEvent =
  | 'APP_STARTED'
  | 'CATALOG_OPENED'
  | 'FAVORITES_OPENED'
  | 'HISTORY_OPENED'
  | 'SETTINGS_OPENED'
  | 'LOADING_SERVICE'
  | 'SITE_OPENED'
  | 'SITE_CHANGED'
  | 'GAMES_OPENED'
  | 'APP_CLOSED';

declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      openExternal: (url: string) => Promise<boolean>;
      rpcState: (event: RpcEvent, siteName?: string) => void;
      rpcClear: () => void;
      setAdblock: (enabled: boolean) => void;
      getRpcStatus: () => Promise<RpcStatusPayload>;
      onRpcStatus: (cb: (s: RpcStatusPayload) => void) => () => void;
    };
  }
}

export type RpcConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error' | 'unavailable';

export interface RpcStatusPayload {
  status: RpcConnectionStatus;
  error: string;
  clientId: string;
}

const inElectron = () => typeof window !== 'undefined' && !!window.electronAPI?.isElectron;

/** services/discordRpc — connect / disconnect / updatePresence / clearPresence / handleAppState.
 *  ТОЛЬКО desktop-модуль (§17 новой доки): активный RPC живёт в Electron main-процессе
 *  через discord-rpc. На Android/iOS такой интеграции нет — мобильное приложение
 *  работает независимо, здесь вызовы тихо становятся no-op с mock-логом. */
let startedAt = Date.now();
let lastState: string = '';

export function connect(): void {
  startedAt = Date.now();
  if (inElectron()) {
    window.electronAPI!.rpcState('APP_STARTED');
  } else {
    console.info('[discord-rpc] web preview mode, presence mocked:', 'APP_STARTED');
  }
}

export function disconnect(): void {
  if (inElectron()) {
    window.electronAPI!.rpcState('APP_CLOSED');
  }
}

export function updatePresence(event: RpcEvent, siteName?: string): void {
  const key = `${event}:${siteName ?? ''}`;
  if (key === lastState) return;
  lastState = key;
  if (inElectron()) {
    window.electronAPI!.rpcState(event, siteName);
  } else {
    const label = siteName ? `Browsing ${siteName}` : event;
    console.info('[discord-rpc]', label, `(uptime ${Math.round((Date.now() - startedAt) / 1000)}s)`);
  }
}

export function clearPresence(): void {
  lastState = '';
  if (inElectron()) window.electronAPI!.rpcClear();
}

/** Текущий статус соединения (desktop — из main, иначе mock). */
export async function getRpcStatus(): Promise<RpcStatusPayload> {
  if (inElectron()) {
    try {
      return await window.electronAPI!.getRpcStatus();
    } catch (e) {
      return { status: 'error', error: (e as Error)?.message || 'IPC error', clientId: '' };
    }
  }
  return { status: 'unavailable', error: 'Только desktop-сборка (Electron)', clientId: '' };
}

/** Подписка на изменения статуса (desktop пушит из main). */
export function onRpcStatusChange(cb: (s: RpcStatusPayload) => void): () => void {
  if (inElectron()) {
    return window.electronAPI!.onRpcStatus(cb);
  }
  return () => {};
}

/** Маппинг состояния приложения → RPC (дока §14–15). */
export function handleAppState(
  route: 'home' | 'catalog' | 'favorites' | 'history' | 'settings' | 'games' | 'site' | 'loading',
  siteName?: string,
): void {
  switch (route) {
    case 'home':
      updatePresence('APP_STARTED');
      break;
    case 'catalog':
      updatePresence('CATALOG_OPENED');
      break;
    case 'favorites':
      updatePresence('FAVORITES_OPENED');
      break;
    case 'history':
      updatePresence('HISTORY_OPENED');
      break;
    case 'settings':
      updatePresence('SETTINGS_OPENED');
      break;
    case 'games':
      updatePresence('GAMES_OPENED', 'Block Blast');
      break;
    case 'loading':
      updatePresence('LOADING_SERVICE', siteName);
      break;
    case 'site':
      updatePresence('SITE_OPENED', siteName);
      break;
  }
}
