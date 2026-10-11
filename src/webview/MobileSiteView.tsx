import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, LayoutGrid, Loader2, MonitorSmartphone } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import type { AnimeSite } from '../data/sites';
import { ErrorState } from '../components/LoadingAndError';
import { openInExternalBrowser } from '../utils/external';
import { adblockInjectJS } from '../services/adblock';
import { useApp } from '../store/useAppStore';
import { handleAppState } from '../services/discordRpc';

declare global {
  interface Window {
    cordova?: {
      InAppBrowser?: {
        open: (
          url: string,
          target: string,
          options: string,
        ) => {
          addEventListener: (ev: string, cb: (e: { url?: string; message?: string; code?: number }) => void) => void;
          removeEventListener: (ev: string, cb: (...args: unknown[]) => void) => void;
          executeScript: (args: { code: string }) => Promise<unknown>;
          close: () => void;
          show: () => void;
        };
      };
    };
  }
}

// Нативный mobile-рендер сервиса (Android/iOS).
// Сайт открывается в отдельном WebView-окне InAppBrowser ПОВЕРХ приложения:
// - страница грузится как главный документ (а не iframe) — запреты
//   встраивания (X-Frame-Options / frame-ancestors) не действуют;
// - сайты отдают мобильную вёрстку, работают куки и Cloudflare;
// - у окна свои Назад/Вперёд/Закрыть, выглядит как часть AniDa.
// Нет плагина (web-превью) — fallback на Capacitor Browser.
export function MobileSiteView({ site }: { site: AnimeSite }) {
  const { backToCatalog, adblockEnabled } = useApp();
  const [state, setState] = useState<'opening' | 'opened' | 'closed' | 'error'>('opening');
  const [currentUrl, setCurrentUrl] = useState(site.url);
  const iabRef = useRef<{ close: () => void; executeScript?: (args: { code: string }) => Promise<unknown> } | null>(null);
  const adblockRef = useRef(adblockEnabled);
  adblockRef.current = adblockEnabled;

  const closeViewer = useCallback(() => {
    try {
      iabRef.current?.close();
    } catch {}
    iabRef.current = null;
  }, []);

  const openFallback = useCallback(async () => {
    try {
      await Browser.open({ url: site.url, toolbarColor: '#05070f' });
      setCurrentUrl(site.url);
      setState('opened');
      handleAppState('site', site.name);
    } catch {
      setState('error');
    }
  }, [site.url, site.name]);

  const openSite = useCallback(() => {
    setState('opening');
    setCurrentUrl(site.url);
    handleAppState('loading', site.name);

    const iab = window.cordova?.InAppBrowser;
    if (!iab) {
      void openFallback();
      return;
    }
    try {
      closeViewer();
      const ref = iab.open(
        site.url,
        '_blank',
        'location=yes,hideurlbar=yes,toolbarcolor=#0c1222,closebuttoncolor=#ffffff,navigationbuttoncolor=#2f7bff,hardwareback=yes,zoom=no',
      );
      iabRef.current = ref;
      ref.addEventListener('loadstart', (e) => {
        if (e.url && e.url.startsWith('http')) setCurrentUrl(e.url);
      });
      ref.addEventListener('loadstop', () => {
        setState('opened');
        handleAppState('site', site.name);
        // Косметика: прячем рекламные контейнеры (сетевой резки в IAB нет).
        if (adblockRef.current) {
          try {
            ref.executeScript?.({ code: adblockInjectJS() })?.catch?.(() => {});
          } catch {}
        }
      });
      ref.addEventListener('loaderror', () => {
        setState('error');
      });
      ref.addEventListener('exit', () => {
        iabRef.current = null;
        setState((s) => (s === 'opened' ? 'closed' : s));
        handleAppState('site', site.name);
      });
    } catch {
      void openFallback();
    }
  }, [site.url, site.name, closeViewer, openFallback]);

  useEffect(() => {
    openSite();
    return () => closeViewer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site.id]);

  const goCatalog = () => {
    closeViewer();
    backToCatalog();
  };

  if (state === 'error') {
    return (
      <ErrorState
        name={site.name}
        url={currentUrl}
        onRetry={openSite}
        onBack={goCatalog}
        onExternal={() => openInExternalBrowser(currentUrl)}
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
          onClick={goCatalog}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: '#fff', fontWeight: 800, fontSize: 13, padding: '8px 14px', minHeight: 44 }}
        >
          <LayoutGrid size={15} /> Каталог
        </button>
        <button
          className="btn-brutal"
          onClick={() => openInExternalBrowser(currentUrl)}
          title="Открыть текущую страницу в системном браузере"
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface-secondary)', color: 'var(--text)', fontWeight: 800, fontSize: 13, padding: '8px 14px', minHeight: 44 }}
        >
          <ExternalLink size={15} /> Браузер
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
            {currentUrl.replace(/^https?:\/\//, '')}
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
              onClick={openSite}
              className="btn-brutal"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--primary)', color: '#fff', fontWeight: 800, fontSize: 15, padding: '12px 22px', minHeight: 48 }}
            >
              <ExternalLink size={17} /> {state === 'closed' ? 'Открыть снова' : 'Открыть сайт'}
            </button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <MonitorSmartphone size={15} style={{ flexShrink: 0, marginTop: 2 }} />
              Сайт открывается поверх AniDa: там работают каталог, серии,
              кнопки Назад/Вперёд и своя мобильная вёрстка.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
