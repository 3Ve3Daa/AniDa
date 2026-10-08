import { AlertTriangle, ExternalLink, Loader2, RotateCcw, LayoutGrid } from 'lucide-react';

export function LoadingScreen({ name }: { name: string }) {
  return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--background)' }}>
      <div className="brutal" style={{ background: 'var(--surface)', padding: 40, textAlign: 'center', maxWidth: 360 }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite' }} color="var(--primary)" />
        <div style={{ fontWeight: 900, fontSize: 18, marginTop: 16 }}>Загрузка {name}…</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
          Открываем сервис внутри AniDa
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
    <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--background)', padding: 24 }}>
      <div className="brutal" style={{ background: 'var(--surface)', padding: 36, textAlign: 'center', maxWidth: 440 }}>
        <div className="brutal-sm" style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', margin: '0 auto', background: 'var(--surface-secondary)' }}>
          <AlertTriangle size={26} color="var(--primary)" />
        </div>
        <div style={{ fontWeight: 900, fontSize: 19, marginTop: 16 }}>Не удалось загрузить {name}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 8, lineHeight: 1.6, wordBreak: 'break-all' }}>
          Сайт запретил встроенное отображение (iframe / CSP / Cloudflare) или недоступен: {url}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={onRetry} className="btn-brutal" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--primary)', color: '#fff', fontWeight: 800, padding: '10px 16px', fontSize: 13 }}>
            <RotateCcw size={15} /> Повторить
          </button>
          <button onClick={onExternal} className="btn-brutal" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-secondary)', color: 'var(--text)', fontWeight: 800, padding: '10px 16px', fontSize: 13 }}>
            <ExternalLink size={15} /> Во внешнем браузере
          </button>
          <button onClick={onBack} className="btn-brutal" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', color: 'var(--text)', fontWeight: 800, padding: '10px 16px', fontSize: 13 }}>
            <LayoutGrid size={15} /> В каталог
          </button>
        </div>
      </div>
    </div>
  );
}
