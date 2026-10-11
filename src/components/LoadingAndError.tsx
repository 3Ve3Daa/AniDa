import { AlertTriangle, ExternalLink, LayoutGrid, Loader2, RotateCcw } from 'lucide-react';

export function LoadingScreen({ name }: { name: string }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--background)',
        padding: 20,
      }}
    >
      <div
        className="brutal glass-panel"
        style={{
          background: 'var(--surface)',
          padding: '36px 32px',
          textAlign: 'center',
          maxWidth: 380,
          width: '100%',
          borderRadius: 18,
          boxShadow: '0 0 24px var(--primary-glow)',
        }}
      >
        <div style={{ position: 'relative', width: 44, height: 44, margin: '0 auto' }}>
          <Loader2
            size={44}
            style={{ animation: 'spin 1s linear infinite' }}
            color="var(--primary)"
          />
        </div>
        <div style={{ fontWeight: 900, fontSize: 18, marginTop: 18, letterSpacing: -0.2 }}>
          Загрузка {name}…
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
          Открываем сервис во встроенном контейнере AniDa
        </div>
      </div>
    </div>
  );
}

export function ErrorState({
  name,
  url,
  onRetry,
  onBack,
  onExternal,
}: {
  name: string;
  url: string;
  onRetry: () => void;
  onBack: () => void;
  onExternal: () => void;
}) {
  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--background)',
        padding: 24,
      }}
    >
      <div
        className="brutal glass-panel"
        style={{
          background: 'var(--surface)',
          padding: 34,
          textAlign: 'center',
          maxWidth: 460,
          width: '100%',
          borderRadius: 18,
          boxShadow: '0 0 24px rgba(239, 68, 68, 0.25)',
        }}
      >
        <div
          className="brutal-sm"
          style={{
            width: 54,
            height: 54,
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto',
            background: 'var(--surface-secondary)',
            borderRadius: 14,
            color: '#ef4444',
            boxShadow: '0 0 12px rgba(239, 68, 68, 0.35)',
          }}
        >
          <AlertTriangle size={26} strokeWidth={2.4} />
        </div>

        <div style={{ fontWeight: 900, fontSize: 19, marginTop: 16 }}>
          Не удалось открыть {name}
        </div>

        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            marginTop: 8,
            lineHeight: 1.55,
            wordBreak: 'break-all',
          }}
        >
          Сайт заблокировал встроенное отображение (Cloudflare / X-Frame-Options) или временно недоступен:
          <div
            style={{
              marginTop: 6,
              background: 'var(--surface-secondary)',
              padding: '6px 10px',
              borderRadius: 6,
              fontFamily: 'monospace',
              fontSize: 11.5,
              color: 'var(--accent)',
            }}
          >
            {url}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={onRetry}
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 800,
              padding: '10px 16px',
              fontSize: 13,
              borderRadius: 10,
              boxShadow: '0 0 12px var(--primary-glow)',
            }}
          >
            <RotateCcw size={15} /> Повторить
          </button>
          <button
            onClick={onExternal}
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--surface-secondary)',
              color: 'var(--text)',
              fontWeight: 800,
              padding: '10px 16px',
              fontSize: 13,
              borderRadius: 10,
            }}
          >
            <ExternalLink size={15} /> Во внешнем браузере
          </button>
          <button
            onClick={onBack}
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--surface)',
              color: 'var(--text)',
              fontWeight: 800,
              padding: '10px 16px',
              fontSize: 13,
              borderRadius: 10,
            }}
          >
            <LayoutGrid size={15} /> В каталог
          </button>
        </div>
      </div>
    </div>
  );
}
