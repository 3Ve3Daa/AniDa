// AniDa preload: изолированный мост renderer <-> main.
// Внешний WebView-контент этот API не получает (contextIsolation + sandbox).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  rpcState: (event, siteName) => ipcRenderer.send('rpc-state', { event, siteName }),
  rpcClear: () => ipcRenderer.send('rpc-clear'),
  getRpcStatus: () => ipcRenderer.invoke('rpc-status'),
  onRpcStatus: (cb) => {
    const listener = (_e, payload) => cb(payload);
    ipcRenderer.on('rpc-status', listener);
    return () => ipcRenderer.removeListener('rpc-status', listener);
  },
});
