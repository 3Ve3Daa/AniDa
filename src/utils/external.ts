import { isAllowedUrl } from '../data/sites';
import { isNativeMobile } from '../services/platform';

/**
 * Открытие внешнего браузера (§2, §16 новой доки).
 * Цепочка: Electron shell → Capacitor Browser (системный механизм на
 * Android/iOS) → обычная вкладка. Внутренние данные сайтам не передаются.
 */
export async function openInExternalBrowser(url: string): Promise<void> {
  if (!isAllowedUrl(url)) {
    console.warn('[security] URL вне whitelist, открываем только системным способом:', url);
  }
  if (window.electronAPI?.openExternal) {
    await window.electronAPI.openExternal(url);
    return;
  }
  if (isNativeMobile()) {
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url });
      return;
    } catch (e) {
      console.warn('[mobile] Browser plugin unavailable, fallback to _system:', (e as Error)?.message);
    }
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
