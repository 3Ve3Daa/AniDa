// AniDa — Electron main process
// Выбор технологии: Electron, т.к. нужен настоящий <webview> для внешних
// аниме-сайтов, системный трей/окно Windows, local settings и discord-rpc
// (Node-модуль). Tauri легче, но webview там ограничен iframe-подходом,
// а Neutralino не даёт зрелого webview-тега. Electron = зрелый webview +
// простая сборка под Windows/macOS/Linux через electron-builder.
const { app, BrowserWindow, shell, ipcMain, Notification } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

// ---- Discord RPC (main-процесс, активный) ----
// Важно: коннект пробуем НЕ один раз при старте, а циклом до успеха —
// Discord часто запускают ПОСЛЕ AniDa, и без ретрая активности не будет.
let rpcClient = null;
let rpcConnected = false;
let rpcStatus = 'disconnected'; // disconnected | connecting | connected | error
let rpcLastError = '';
let rpcRetryTimer = null;
let pendingPresence = { details: 'Main Menu', state: 'Browsing anime platforms' };
const rpcStartedAt = Math.floor(Date.now() / 1000);
const DISCORD_CLIENT_ID = process.env.ANIDA_DISCORD_CLIENT_ID || '1556678610407133264';

function broadcastRpcStatus() {
  const payload = { status: rpcConnected ? 'connected' : rpcStatus, error: rpcLastError, clientId: DISCORD_CLIENT_ID };
  for (const w of BrowserWindow.getAllWindows()) {
    try {
      w.webContents.send('rpc-status', payload);
    } catch {}
  }
}

function scheduleRpcRetry() {
  if (rpcRetryTimer || rpcConnected) return;
  rpcRetryTimer = setTimeout(() => {
    rpcRetryTimer = null;
    connectRpc();
  }, 10000);
}

async function connectRpc() {
  if (rpcConnected || (rpcClient && rpcStatus === 'connecting')) return;
  rpcStatus = 'connecting';
  rpcLastError = '';
  broadcastRpcStatus();
  try {
    const RPC = require('discord-rpc');
    try {
      RPC.register(DISCORD_CLIENT_ID);
    } catch {}
    rpcClient = new RPC.Client({ transport: 'ipc' });
    rpcClient.on('ready', () => {
      rpcConnected = true;
      rpcStatus = 'connected';
      rpcLastError = '';
      console.log('[discord-rpc] connected');
      broadcastRpcStatus();
      if (pendingPresence) setPresence(pendingPresence);
    });
    const onLost = (msg) => {
      rpcConnected = false;
      rpcStatus = 'disconnected';
      rpcLastError = msg || '';
      try {
        rpcClient = null;
      } catch {}
      broadcastRpcStatus();
      scheduleRpcRetry();
    };
    rpcClient.on('disconnected', () => onLost(''));
    rpcClient.transport?.on?.('close', () => onLost('Discord closed connection'));
    // login без таймаута может висеть вечно, если IPC Discord не отвечает, —
    // тогда статус навсегда застревает в 'connecting'. Ограничиваем 15 сек.
    const loginPromise = rpcClient.login({ clientId: DISCORD_CLIENT_ID });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Discord IPC timeout (15s): Discord не отвечает на pipe')), 15000),
    );
    await Promise.race([loginPromise, timeoutPromise]).catch((e) => {
      // Discord не запущен / нет такого Application ID / IPC недоступен
      rpcLastError = e?.message || String(e);
      rpcStatus = 'error';
      try {
        rpcClient.destroy?.();
      } catch {}
      rpcClient = null;
      console.warn('[discord-rpc] login failed, retry in 10s:', rpcLastError);
      broadcastRpcStatus();
      scheduleRpcRetry();
    });
  } catch (e) {
    rpcLastError = e?.message || String(e);
    rpcStatus = 'error';
    rpcClient = null;
    console.warn('[discord-rpc] unavailable, retry in 10s:', rpcLastError);
    broadcastRpcStatus();
    scheduleRpcRetry();
  }
}

function setPresence({ details, state }) {
  pendingPresence = { details, state };
  if (!rpcClient || !rpcConnected) return;
  // Без largeImageKey: арт-ассета 'anida' в портале может не быть, а несуществующий
  // ключ картинки заставляет Discord отклонять activity. Картинку вернём, когда
  // в Rich Presence → Art Assets загрузят ассет (можно тот же ava.png).
  try {
    rpcClient.setActivity({
      details: String(details).slice(0, 128),
      state: String(state || '').slice(0, 128),
      startTimestamp: rpcStartedAt,
      instance: false,
    });
  } catch (e) {
    console.warn('[discord-rpc] setActivity failed:', e.message);
  }
}

function clearPresence() {
  pendingPresence = { details: 'Main Menu', state: 'Browsing anime platforms' };
  if (!rpcClient || !rpcConnected) return;
  try {
    rpcClient.clearActivity();
  } catch {}
}

ipcMain.handle('rpc-status', () => ({
  status: rpcConnected ? 'connected' : rpcStatus,
  error: rpcLastError,
  clientId: DISCORD_CLIENT_ID,
}));

// События APP_STARTED → CATALOG_OPENED → SITE_OPENED → SITE_CHANGED → APP_CLOSED
const PRESENCE_MAP = {
  APP_STARTED: { details: 'Main Menu', state: 'Browsing anime platforms' },
  CATALOG_OPENED: { details: 'Anime Catalog', state: 'Viewing Anime Catalog' },
  FAVORITES_OPENED: { details: 'Favorites', state: 'Viewing favorites' },
  HISTORY_OPENED: { details: 'History', state: 'Viewing history' },
  SETTINGS_OPENED: { details: 'Settings', state: 'Changing settings' },
  LOADING_SERVICE: { details: 'Loading…', state: 'Loading a service' },
};

ipcMain.on('rpc-state', (_e, payload) => {
  if (!payload) return;
  if (payload.event === 'APP_CLOSED') {
    clearPresence();
    return;
  }
  if (payload.event === 'SITE_OPENED' || payload.event === 'SITE_CHANGED') {
    const name = payload.siteName || 'Unknown service';
    setPresence({ details: name, state: `Browsing ${name}` });
    return;
  }
  const mapped = PRESENCE_MAP[payload.event];
  if (mapped) setPresence(mapped);
});

ipcMain.on('rpc-clear', () => clearPresence());

// ---- Безопасность: whitelist ----
const ALLOWED_HOSTS = [
  'anilibria.tv',
  'anilibria.top',
  'yummyani.me',
  'ru.yummyani.me',
  'jut-su.net',
  'jut.su',
  'kinogo.mu',
  'loft.kinogo.mu',
  'shikimori.one',
  'shikimori.me',
  'animego.org',
  'amedia.site',
  'anixart.tv',
];

function isAllowedUrl(raw) {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    return ALLOWED_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

ipcMain.handle('open-external', async (_e, url) => {
  if (!isAllowedUrl(url)) {
    // Неизвестные URL всё равно открываем, но только через системный браузер,
    // без доступа к внутренностям приложения.
    console.warn('[security] external URL not in whitelist:', url);
  }
  await shell.openExternal(url);
  return true;
});

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: '#05070f',
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true, // встроенный WebView для каталога
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // WebView: внешний контент не получает node-доступ; внутренние
  // anida:// ссылки запрещены. Перехватываем попытки открыть новое окно.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  connectRpc();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  clearPresence();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  clearPresence();
  try {
    if (rpcClient) rpcClient.destroy();
  } catch {}
});
