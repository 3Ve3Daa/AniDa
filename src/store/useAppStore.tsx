import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AnimeSite } from '../data/sites';
import { SITES } from '../data/sites';
import type { ThemeId } from '../themes/themes';
import { useLocalStorage } from '../services/storage';
import { defaultSyncProvider } from '../services/sync';
import { handleAppState, connect, disconnect } from '../services/discordRpc';

export type Route =
  | { name: 'home' }
  | { name: 'catalog' }
  | { name: 'favorites' }
  | { name: 'history' }
  | { name: 'settings' }
  | { name: 'site'; siteId: string };

export interface HistoryEntry {
  siteId: string;
  openedAt: number;
}

interface AppState {
  route: Route;
  go: (r: Route) => void;
  openSite: (site: AnimeSite) => void;
  backToCatalog: () => void;
  query: string;
  setQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
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
  activeSite: AnimeSite | null;
  sites: AnimeSite[];
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useLocalStorage<string[]>('anida:favorites', []);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('anida:history', []);
  const [theme, setThemeState] = useLocalStorage<ThemeId>('anida:theme', 'black-blue');
  const [customColors, setCustomColors] = useLocalStorage('anida:custom-colors', {
    bg: '#05070f',
    surface: '#0c1222',
    surface2: '#131b31',
    primary: '#2f7bff',
  });
  const [hasOnboarded, setOnboarded] = useLocalStorage('anida:onboarded', false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'custom') {
      const root = document.documentElement.style;
      root.setProperty('--custom-bg', customColors.bg);
      root.setProperty('--custom-surface', customColors.surface);
      root.setProperty('--custom-surface2', customColors.surface2);
      root.setProperty('--custom-primary', customColors.primary);
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
      handleAppState(route.name as 'home' | 'catalog' | 'favorites' | 'history' | 'settings');
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
      activeSite,
      sites: SITES,
    };
  }, [route, query, activeCategory, favorites, history, theme, customColors, hasOnboarded, setFavorites, setHistory, setThemeState, setCustomColors, setOnboarded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp outside provider');
  return ctx;
}
