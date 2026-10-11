import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AnimeSite } from '../data/sites';
import { SITES } from '../data/sites';
import type { ThemeId } from '../themes/themes';
import { useLocalStorage } from '../services/storage';
import { defaultSyncProvider } from '../services/sync';
import { isNativeMobile } from '../services/platform';
import { handleAppState, connect, disconnect } from '../services/discordRpc';

export type Route =
  | { name: 'home' }
  | { name: 'catalog' }
  | { name: 'favorites' }
  | { name: 'history' }
  | { name: 'settings' }
  | { name: 'games' }
  | { name: 'site'; siteId: string };

export interface HistoryEntry {
  siteId: string;
  openedAt: number;
}

export type SortOrder = 'recommended' | 'name' | 'recent';

interface AppState {
  route: Route;
  go: (r: Route) => void;
  openSite: (site: AnimeSite) => void;
  backToCatalog: () => void;
  query: string;
  setQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (s: SortOrder) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  history: HistoryEntry[];
  clearHistory: () => void;
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  customColors: { bg: string; surface: string; surface2: string; primary: string };
  setCustomColors: (c: AppState['customColors']) => void;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  adblockEnabled: boolean;
  setAdblockEnabled: (v: boolean) => void;
  activeSite: AnimeSite | null;
  sites: AnimeSite[];
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOrder, setSortOrder] = useLocalStorage<SortOrder>('anida:sort', 'recommended');
  const [favorites, setFavorites] = useLocalStorage<string[]>('anida:favorites', []);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('anida:history', []);
  // Дефолтная тема: на телефоне — Minimal, на десктопе — классика.
  const [theme, setThemeState] = useLocalStorage<ThemeId>(
    'anida:theme',
    isNativeMobile() ? 'minimal' : 'black-blue',
  );
  const [customColors, setCustomColors] = useLocalStorage('anida:custom-colors', {
    bg: '#05070f',
    surface: '#0c1222',
    surface2: '#131b31',
    primary: '#2f7bff',
  });
  const [hasOnboarded, setOnboarded] = useLocalStorage('anida:onboarded', false);
  const [adblockEnabled, setAdblockEnabledState] = useLocalStorage('anida:adblock', true);

  // Переключатель доезжает до main-процесса (там режутся запросы).
  const setAdblockEnabled = useCallback(
    (v: boolean) => {
      setAdblockEnabledState(v);
      try {
        window.electronAPI?.setAdblock?.(v);
      } catch {}
    },
    [setAdblockEnabledState],
  );

  useEffect(() => {
    try {
      window.electronAPI?.setAdblock?.(adblockEnabled);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'custom') {
      const root = document.documentElement.style;
      root.setProperty('--custom-bg', customColors.bg);
      root.setProperty('--custom-surface', customColors.surface);
      root.setProperty('--custom-surface2', customColors.surface2);
      root.setProperty('--custom-primary', customColors.primary);
    }
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const bg = theme === 'custom' ? customColors.bg : getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
      if (bg) metaThemeColor.setAttribute('content', bg);
    }
  }, [theme, customColors]);

  useEffect(() => {
    connect();
    const onUnload = () => disconnect();
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);

  // §4: данные идут через sync-провайдер (сейчас local — работает без аккаунта).
  // Remote-синк подключается заменой defaultSyncProvider, UI менять не нужно.
  useEffect(() => {
    defaultSyncProvider.save({ favorites, history, theme, customColors, onboarded: hasOnboarded });
  }, [favorites, history, theme, customColors, hasOnboarded]);

  // Активный RPC при каждой смене маршрута
  useEffect(() => {
    if (route.name === 'site') {
      const s = SITES.find((x) => x.id === (route as { siteId: string }).siteId);
      handleAppState('site', s?.name);
    } else {
      handleAppState(route.name as 'home' | 'catalog' | 'favorites' | 'history' | 'settings' | 'games');
    }
  }, [route]);

  const value = useMemo<AppState>(() => {
    const activeSite =
      route.name === 'site' ? SITES.find((s) => s.id === route.siteId) ?? null : null;
    return {
      route,
      go: setRoute,
      openSite: (site) => {
        setHistory((prev) => [{ siteId: site.id, openedAt: Date.now() }, ...prev.filter((h) => h.siteId !== site.id)].slice(0, 30));
        setRoute({ name: 'site', siteId: site.id });
      },
      backToCatalog: () => setRoute({ name: 'catalog' }),
      query,
      setQuery,
      activeCategory,
      setActiveCategory,
      sortOrder,
      setSortOrder,
      favorites,
      toggleFavorite: (id) =>
        setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])),
      isFavorite: (id) => favorites.includes(id),
      history,
      clearHistory: () => setHistory([]),
      theme,
      setTheme: setThemeState,
      customColors,
      setCustomColors,
      hasOnboarded,
      completeOnboarding: () => setOnboarded(true),
      adblockEnabled,
      setAdblockEnabled,
      activeSite,
      sites: SITES,
    };
  }, [route, query, activeCategory, sortOrder, favorites, history, theme, customColors, hasOnboarded, adblockEnabled, setAdblockEnabled, setFavorites, setHistory, setThemeState, setCustomColors, setOnboarded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp outside provider');
  return ctx;
}
