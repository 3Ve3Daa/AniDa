import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, LayoutGrid, Loader2, MonitorSmartphone } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import type { AnimeSite } from '../data/sites';
import { ErrorState } from '../components/LoadingAndError';
import { useApp } from '../store/useAppStore';
import { handleAppState } from '../services/discordRpc';

// Нативный mobile-рендер сервиса (Android/iOS через Capacitor).
// Сайты запрещают встраивание в iframe (X-Frame-Options / frame-ancestors →
// ERR_BLOCKED_BY_RESPONSE), поэтому вместо iframe открываем сайт в системном
// браузерном листе (Chrome Custom Tabs / SFSafariViewController):
// - нет ограничений фрейминга, работают куки и Cloudflare;
// - сайты отдают МОБИЛЬНУЮ вёрстку (настоящий мобильный Chrome UA);
// - внутри листа своя навигация Назад/Вперёд/Обновить и меню «Открыть в Chrome».
export function MobileSiteView({ site }: { site: AnimeSite }) {
  const { backToCatalog } = useApp();
  const [state, setState] = useState<'opening' | 'opened' | 'closed' | 'error'>('opening');
  const openedFor = useRef<string>('');

  const openBrowser = useCallback(async () => {
    setState('opening');
    handleAppState('loading', site.name);
    try {
      await Browser.open({ url: site.url, toolbarColor: '#05070f' });
      openedFor.current = site.url;
      setState('opened');
      handleAppState('site', site.name);
    } catch (e) {
      console.warn('[mobile] Browser.open failed:', (e as Error)?.message);
      setState('error');
    }
  }, [site.url, site.name]);

  useEffect(() => {
    void openBrowser();
  }, [openBrowser]);

  // Пользователь закрыл лист свайпом/крестиком — показываем экран повтора.
  useEffect(() => {
    let handle: { remove: () => void } | null = null;
    Browser.addListener('browserFinished', () => {
      setState((s) => (s === 'opened' ? 'closed' : s));
      handleAppState('site', site.name);
    }).then((h) => {
      handle = h;
    });
    return () => {
      try {
        handle?.remove();
      } catch {}
    };
  }, [site.name]);

  if (state === 'error') {
    return (
      <ErrorState
        name={site.name}
        url={site.url}
        onRetry={openBrowser}
        onBack={backToCatalog}
        onExternal={openBrowser}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div
        className="brutal-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--surface)',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 14, flex: '1 1 100%', order: -1 }}>
          {site.name}
        </div>
        <button
          className="btn-brutal"
          onClick={backToCatalog}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: '#fff', fontWeight: 800, fontSize: 13, padding: '8px 14px', minHeight: 44 }}
        >
          <LayoutGrid size={15} /> Каталог
        </button>
      </div>

      <div className="brutal" style={{ background: 'var(--surface)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', flex: 1, justifyContent: 'center' }}>
        <div className="brutal-sm" style={{ width: 84, height: 84, overflow: 'hidden', padding: 0, background: 'var(--surface-secondary)' }}>
          {site.logo ? (
            <img src={site.logo} alt={site.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <span style={{ display: 'grid', placeItems: 'center', height: '100%', fontWeight: 900, fontSize: 26, color: 'var(--primary)' }}>
              {site.logoText}
            </span>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>{site.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, wordBreak: 'break-all' }}>
            {site.url}
          </div>
        </div>
        {state === 'opening' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontWeight: 700, fontSize: 14 }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Открываем {site.name}…
          </div>
        ) : (
          <>
            <button
              onClick={openBrowser}
              className="btn-brutal"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--primary)', color: '#fff', fontWeight: 800, fontSize: 15, padding: '12px 22px', minHeight: 48 }}
            >
              <ExternalLink size={17} /> {state === 'closed' ? 'Открыть снова' : 'Открыть сайт'}
            </button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <MonitorSmartphone size={15} style={{ flexShrink: 0, marginTop: 2 }} />
              Сайт открывается в мобильном браузере: там работают каталог, серии,
              кнопки Назад/Вперёд и своя мобильная вёрстка.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
