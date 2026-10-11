import { ArrowRight, LayoutGrid } from 'lucide-react';
import { useApp } from '../store/useAppStore';

// Hero главной по референсу: тёмный фон с teal-свечением слева,
// крупный заголовок, описание и две кнопки без визуального шума.
export function HeroBanner() {
  const { sites, go, openSite, history } = useApp();
  const lastSite = history.length > 0 ? sites.find((s) => s.id === history[0].siteId) ?? null : null;

  return (
    <section
      className="anida-hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        border: '1px solid var(--border-subtle)',
        background:
          'radial-gradient(circle at 8% 20%, rgba(95, 208, 187, 0.14), transparent 42%), linear-gradient(180deg, var(--surface) 0%, var(--background) 100%)',
        padding: '44px 40px',
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>
          Единый лаунчер аниме-платформ
        </div>
        <h1 style={{ margin: '0 0 14px', fontWeight: 900, fontSize: 40, letterSpacing: -1, lineHeight: 1.1 }}>
          Открыл AniDa —
          <br />
          выбрал сервис
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-secondary)', maxWidth: 460 }}>
          {sites.length} платформ в одном каталоге: избранное, история и встроенный
          просмотр без лишнего шума.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => go({ name: 'catalog' })}
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--primary)',
              color: '#06231d',
              fontWeight: 800,
              padding: '12px 22px',
              fontSize: 14,
              borderRadius: 10,
              border: 'none',
            }}
          >
            <LayoutGrid size={16} strokeWidth={2.4} /> Открыть каталог
          </button>
          {lastSite && (
            <button
              onClick={() => openSite(lastSite)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                color: 'var(--text)',
                fontWeight: 700,
                padding: '12px 8px',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Продолжить: {lastSite.name} <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
