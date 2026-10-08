import { useState } from 'react';
import { ExternalLink, Play, Star } from 'lucide-react';
import type { AnimeSite } from '../data/sites';
import { useApp } from '../store/useAppStore';

export function SiteCard({ site }: { site: AnimeSite }) {
  const { openSite, toggleFavorite, isFavorite, history } = useApp();
  const fav = isFavorite(site.id);
  const lastOpen = history.find((h) => h.siteId === site.id);
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = !!site.logo && !logoFailed;

  return (
    <article
      className="brutal"
      style={{ background: 'var(--surface)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div
          className="brutal-sm"
          style={{
            width: 52,
            height: 52,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--surface-secondary)',
            color: 'var(--primary)',
            fontWeight: 900,
            fontSize: 18,
            flexShrink: 0,
            overflow: 'hidden',
            padding: 0,
          }}
        >
          {showLogo ? (
            <img
              src={site.logo}
              alt={`Логотип ${site.name}`}
              loading="lazy"
              onError={() => setLogoFailed(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            site.logoText
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{site.name}</h3>
            {site.featured && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: 'var(--primary)',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: 999,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Топ
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
            {new URL(site.url).hostname}
            {lastOpen ? ` · открыт ${new Date(lastOpen.openedAt).toLocaleDateString('ru-RU')}` : ''}
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(site.id)}
          className="btn-brutal"
          title={fav ? 'Убрать из избранного' : 'В избранное'}
          style={{
            marginLeft: 'auto',
            width: 36,
            height: 36,
            display: 'grid',
            placeItems: 'center',
            background: fav ? 'var(--primary)' : 'var(--surface-secondary)',
            color: fav ? '#fff' : 'var(--text)',
            flexShrink: 0,
          }}
        >
          <Star size={17} strokeWidth={2.2} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, minHeight: 42 }}>
        {site.description}
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {site.tags?.map((t) => (
          <span
            key={t}
            style={{
              fontSize: 11,
              fontWeight: 700,
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              padding: '3px 9px',
              borderRadius: 999,
              color: 'var(--text-secondary)',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
        <button
          onClick={() => openSite(site)}
          className="btn-brutal"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 14,
            padding: '10px 12px',
          }}
        >
          <Play size={16} strokeWidth={2.4} /> Открыть
        </button>
        <span
          className="brutal-sm"
          style={{
            display: 'grid',
            placeItems: 'center',
            padding: '0 10px',
            background: 'var(--surface-secondary)',
            color: 'var(--text-secondary)',
          }}
          title={site.url}
        >
          <ExternalLink size={15} />
        </span>
      </div>
    </article>
  );
}
