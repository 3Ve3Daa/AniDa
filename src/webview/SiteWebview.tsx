import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, LayoutGrid, Loader2, RotateCw, ShieldAlert } from 'lucide-react';
import type { AnimeSite } from '../data/sites';
import { isAllowedUrl, isUrlAllowedForSite } from '../data/sites';
import { ErrorState, LoadingScreen } from '../components/LoadingAndError';
import { openInExternalBrowser } from '../utils/external';
import { useApp } from '../store/useAppStore';
import { handleAppState } from '../services/discordRpc';
import { isNativeMobile, useIsMobile } from '../services/platform';
import { MobileSiteView } from './MobileSiteView';

// Браузерный контейнер сервиса:
// - старт с site.url, дальше свободная навигация внутри site.allowedOrigins
//   (сравнение через URL.origin, НЕ startsWith);
// - Back/Forward/Reload работают с ТЕКУЩЕЙ страницей;
// - «Внешний браузер» открывает ТЕКУЩИЙ URL;
// - window.open/target=_blank внутри origin → тот же вью, наружу → системный браузер;
// - ошибка показывается только при падении главной рамки (сабфреймы/ERR_ABORTED игнорируются).
export function SiteWebview({ site }: { site: AnimeSite }) {
  const { backToCatalog } = useApp();
  const isMobile = useIsMobile();
  // Нативный телефон: iframe заблокирован сайтами (X-Frame-Options) —
  // открываем через системный браузерный лист вместо встроенного фрейма.
  if (isNativeMobile()) {
    return <MobileSiteView site={site} />;
  }
  return <SiteWebviewInner site={site} backToCatalog={backToCatalog} isMobile={isMobile} />;
}

function SiteWebviewInner({
  site,
  backToCatalog,
  isMobile,
}: {
  site: AnimeSite;
  backToCatalog: () => void;
  isMobile: boolean;
}) {
  const ref = useRef<any>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [currentUrl, setCurrentUrl] = useState(site.url);
  const [canBack, setCanBack] = useState(false);
  const [canFwd, setCanFwd] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const isElectron = !!window.electronAPI?.isElectron;
  const allowed = isAllowedUrl(site.url);

  useEffect(() => {
    handleAppState('loading', site.name);
    setFirstLoad(true);
    setNavigating(false);
    setStatus('loading');
    setCurrentUrl(site.url);
    setCanBack(false);
    setCanFwd(false);
    setBlocked(false);
  }, [site.id, site.name, site.url]);

  useEffect(() => {
    const el = ref.current as any;
    if (!el || !isElectron) return;

    const syncNavState = () => {
      try {
        setCanBack(el.canGoBack());
        setCanFwd(el.canGoForward());
        const url = el.getURL?.();
        if (typeof url === 'string' && url.startsWith('http')) setCurrentUrl(url);
      } catch {}
    };

    const onStartLoading = () => setNavigating(true);
    const onStopLoading = () => {
      setNavigating(false);
      setStatus((s) => (s === 'error' ? s : 'ready'));
      handleAppState('site', site.name);
      syncNavState();
    };
    // did-fail-load: реагируем ТОЛЬКО на главную рамку, ERR_ABORTED (-3) — не ошибка
    // (прерванные загрузки при быстрой навигации — норма).
    const onFailLoad = (_e: unknown, errorCode: number, _desc: string, _url: string, isMainFrame: boolean) => {
      if (!isMainFrame || errorCode === -3) return;
      setNavigating(false);
      setStatus('error');
    };
    const onNavigate = (e: unknown, url: string) => {
      void e;
      if (url.startsWith('http')) setCurrentUrl(url);
      handleAppState('site', site.name);
      syncNavState();
    };
    // window.open / target=_blank:
    // разрешённый origin → внутри текущего вью, внешний → системный браузер.
    const onNewWindow = (e: { preventDefault: () => void }, url: string) => {
      if (isUrlAllowedForSite(url, site)) {
        e.preventDefault();
        try {
          el.loadURL(url);
        } catch {}
      } else {
        e.preventDefault();
        openInExternalBrowser(url);
      }
    };

    el.addEventListener('did-start-loading', onStartLoading);
    el.addEventListener('did-stop-loading', onStopLoading);
    el.addEventListener('did-finish-load', onStopLoading);
    el.addEventListener('did-fail-load', onFailLoad);
    el.addEventListener('did-navigate', onNavigate);
    el.addEventListener('did-navigate-in-page', onNavigate);
    el.addEventListener('did-redirect-navigation', onNavigate);
    el.addEventListener('new-window', onNewWindow);
    return () => {
      el.removeEventListener('did-start-loading', onStartLoading);
      el.removeEventListener('did-stop-loading', onStopLoading);
      el.removeEventListener('did-finish-load', onStopLoading);
      el.removeEventListener('did-fail-load', onFailLoad);
      el.removeEventListener('did-navigate', onNavigate);
      el.removeEventListener('did-navigate-in-page', onNavigate);
      el.removeEventListener('did-redirect-navigation', onNavigate);
      el.removeEventListener('new-window', onNewWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isElectron, site]);

  useEffect(() => {
    if (status === 'ready') setFirstLoad(false);
  }, [status]);

  // Web-режим (vite dev в браузере): iframe может быть заблокирован X-Frame-Options.
  const handleIframeLoad = () => {
    setStatus('ready');
    handleAppState('site', site.name);
  };

  const goBack = () => {
    try {
      if (isElectron && ref.current?.canGoBack()) ref.current.goBack();
    } catch {}
  };
  const goForward = () => {
    try {
      if (isElectron && ref.current?.canGoForward()) ref.current.goForward();
    } catch {}
  };
  // Reload ТЕКУЩЕЙ страницы, не homepage.
  const reload = () => {
    setStatus((s) => (s === 'error' ? 'loading' : s));
    setNavigating(true);
    try {
      if (isElectron) ref.current?.reload();
      else {
        const f = document.getElementById('anida-frame') as HTMLIFrameElement | null;
        if (f) f.src = f.src;
      }
    } catch {}
  };

  const toolbarBtn = (disabled: boolean): React.CSSProperties => ({
    width: isMobile ? 44 : 36,
    height: isMobile ? 44 : 36,
    display: 'grid',
    placeItems: 'center',
    background: 'var(--surface-secondary)',
    color: 'var(--text)',
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'default' : 'pointer',
    flexShrink: 0,
    touchAction: 'manipulation',
  });

  // На mobile iframe-историю листать нельзя — показываем только Обновить.
  const showNavButtons = isElectron;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Верхняя панель: компактная на mobile, полная на desktop */}
      <div
        className="brutal-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--surface)',
          padding: isMobile ? '8px' : '10px 12px',
          marginBottom: 12,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}
      >
        {showNavButtons && (
          <>
            <button className="btn-brutal" style={toolbarBtn(!canBack)} title="Назад"
              onClick={goBack} disabled={!canBack}>
              <ArrowLeft size={17} />
            </button>
            <button className="btn-brutal" style={toolbarBtn(!canFwd)} title="Вперёд"
              onClick={goForward} disabled={!canFwd}>
              <ArrowRight size={17} />
            </button>
          </>
        )}
        <button className="btn-brutal" style={toolbarBtn(false)} title="Обновить текущую страницу" onClick={reload}>
          {navigating ? (
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <RotateCw size={16} />
          )}
        </button>
        <div style={{ fontWeight: 800, fontSize: isMobile ? 13 : 14, marginLeft: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: isMobile ? '1 1 100%' : undefined, order: isMobile ? -1 : undefined }}>
          {site.name}
          {!isMobile && (
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}> · {currentUrl.replace(/^https?:\/\//, '')}</span>
          )}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            className="btn-brutal"
            title="Открыть текущую страницу во внешнем браузере"
            onClick={() => openInExternalBrowser(currentUrl)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface-secondary)', color: 'var(--text)', fontWeight: 800, fontSize: 12, padding: '8px 12px', minHeight: isMobile ? 44 : undefined }}
          >
            <ExternalLink size={14} /> {isMobile ? 'Браузер' : 'Внешний браузер'}
          </button>
          <button
            className="btn-brutal"
            title="Вернуться в каталог"
            onClick={backToCatalog}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: '#fff', fontWeight: 800, fontSize: 12, padding: '8px 12px', minHeight: isMobile ? 44 : undefined }}
          >
            <LayoutGrid size={14} /> {isMobile ? '' : 'Каталог'}
          </button>
        </div>
      </div>

      {!allowed && (
        <div className="brutal-sm" style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--surface)', padding: '8px 12px', marginBottom: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
          <ShieldAlert size={15} color="var(--primary)" />
          URL вне whitelist — встроенный просмотр ограничен, используйте внешний браузер.
          <button onClick={() => openInExternalBrowser(currentUrl)} className="btn-brutal" style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, padding: '6px 10px', background: 'var(--surface-secondary)', color: 'var(--text)' }}>
            Открыть снаружи
          </button>
        </div>
      )}

      <div className="brutal" style={{ flex: 1, overflow: 'hidden', background: '#000', position: 'relative', minHeight: 0 }}>
        {firstLoad && status === 'loading' && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
            <LoadingScreen name={site.name} />
          </div>
        )}
        {status === 'error' ? (
          <ErrorState
            name={site.name}
            url={currentUrl}
            onRetry={reload}
            onBack={backToCatalog}
            onExternal={() => openInExternalBrowser(currentUrl)}
          />
        ) : isElectron ? (
          <webview
            ref={ref}
            src={site.url}
            style={{ width: '100%', height: '100%' }}
            allowpopups
            {...({ partition: 'persist:anida' } as object)}
          />
        ) : (
          <>
            <iframe
              id="anida-frame"
              src={site.url}
              title={site.name}
              onLoad={handleIframeLoad}
              onError={() => setStatus('error')}
              style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
            />
            {/* Если сайт запретил iframe (X-Frame-Options), показываем fallback поверх */}
            {blocked && (
              <div style={{ position: 'absolute', inset: 0 }}>
                <ErrorState
                  name={site.name}
                  url={currentUrl}
                  onRetry={reload}
                  onBack={backToCatalog}
                  onExternal={() => openInExternalBrowser(currentUrl)}
                />
              </div>
            )}
            {!blocked && status === 'ready' && (
              <button
                onClick={() => setBlocked(true)}
                title="Если сайт не отобразился — показать fallback"
                style={{ position: 'absolute', bottom: 12, right: 12, fontSize: 11, opacity: 0.7 }}
              >
                сайт не открылся?
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
