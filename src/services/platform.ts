import { useEffect, useState } from 'react';

export type AppPlatform = 'electron' | 'capacitor' | 'web';

declare global {
  interface Window {
    Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string };
  }
}

/** Платформа запуска: desktop (Electron) / mobile (Capacitor) / web-превью. */
export function getPlatform(): AppPlatform {
  if (typeof window !== 'undefined' && !!window.electronAPI?.isElectron) return 'electron';
  if (typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.()) return 'capacitor';
  return 'web';
}

/** Мобильный нативный рантайм (Android/iOS через Capacitor). */
export function isNativeMobile(): boolean {
  try {
    return !!window.Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

export function isDesktop(): boolean {
  return getPlatform() === 'electron';
}

/** Mobile layout: узкий экран ИЛИ touch-first ИЛИ нативная платформа. */
export function matchesMobileLayout(): boolean {
  if (typeof window === 'undefined') return false;
  if (isNativeMobile()) return true;
  const narrow = window.matchMedia('(max-width: 820px)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return narrow || (coarse && window.innerWidth < 1100);
}

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState<boolean>(() => matchesMobileLayout());
  useEffect(() => {
    const mqNarrow = window.matchMedia('(max-width: 820px)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    const update = () => setMobile(matchesMobileLayout());
    mqNarrow.addEventListener('change', update);
    mqCoarse.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      mqNarrow.removeEventListener('change', update);
      mqCoarse.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);
  return mobile;
}
