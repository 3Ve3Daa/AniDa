import { useState } from 'react';
import { ExternalLink, Flame, Globe, Play, Star } from 'lucide-react';
import type { AnimeSite } from '../data/sites';
import { useApp } from '../store/useAppStore';
import { openInExternalBrowser } from '../utils/external';

// Компактная постер-карточка для горизонтального ряда:
// большая обложка-логотип, название и домен. Клик — открыть.
export function PosterCard({ site }: { site: AnimeSite }) {
  const { openSite } = useApp();
  const [logoFailed, setLogoFailed] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <article className="anim-card" style={{ minWidth: 0, position: 'relative' }}>
      <FavStar siteId={site.id} />
      <button
        onClick={() => openSite(site)}
        aria-label={`Открыть ${site.name}`}
        style={{
          display: 'block',
          width: '100%',
          padding: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text)',
        }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: '16 / 9',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid var(--border)',
            background: 'var(--surface-secondary)',
          }}
        >
          {site.logo && !logoFailed ? (
            <img
              src={site.logo}
              alt=""
              loading="lazy"
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoFailed(true)}
              className={logoLoaded ? 'logo-fade is-loaded' : 'logo-fade'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                height: '100%',
                fontWeight: 900,
                fontSize: 30,
                color: 'var(--primary)',
              }}
            >
              {site.logoText}
            </span>
          )}
        </div>
        <div style={{ padding: '8px 2px 0' }}>
          <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {site.name}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {new URL(site.url).hostname}
          </div>
        </div>
      </button>
    </article>
  );
}

function FavStar({ siteId }: { siteId: string }) {
  const { toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(siteId);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(siteId);
      }}
      aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 30,
        height: 30,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 999,
        background: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: fav ? 'var(--primary)' : '#fff',
        cursor: 'pointer',
      }}
    >
      <Star size={14} fill={fav ? 'currentColor' : 'none'} />
    </button>
  );
}

export function SiteCard({ site }: { site: AnimeSite }) {
  const { openSite, toggleFavorite, isFavorite, history } = useApp();
  const fav = isFavorite(site.id);
  const lastOpen = history.find((h) => h.siteId === site.id);
  const [logoFailed, setLogoFailed] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const showLogo = Boolean(site.logo && !logoFailed);

  const formatLastSeen = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 5) return 'Только что';
    if (mins < 60) return `${mins} мин. назад`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ч. назад`;
    return new Date(timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <article
      className="brutal card-interactive anim-card"
      style={{
        background: 'var(--surface)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        borderRadius: 'var(--radius)',
        position: 'relative',
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Logo Container */}
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
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          }}
        >
          {showLogo ? (
            <img
              src={site.logo}
              alt={`Логотип ${site.name}`}
              loading="lazy"
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoFailed(true)}
              className={logoLoaded ? 'logo-fade is-loaded' : 'logo-fade'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <span
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {site.logoText}
            </span>
          )}
        </div>

        {/* Title & Metadata */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <h3
              style={{
                margin: 0,
                fontSize: 16.5,
                fontWeight: 800,
                letterSpacing: -0.2,
                color: 'var(--text)',
              }}
            >
              {site.name}
            </h3>
            {site.featured && (
              <span
                className="badge-pill pulse-badge"
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  boxShadow: '0 0 8px var(--primary-glow)',
                }}
              >
                <Flame size={11} strokeWidth={2.8} /> ТОП
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: 'var(--text-secondary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginTop: 3,
            }}
          >
            <Globe size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {new URL(site.url).hostname}
            </span>
            {lastOpen && (
              <>
                <span>•</span>
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>
                  {formatLastSeen(lastOpen.openedAt)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(site.id)}
          className="btn-brutal"
          aria-label={fav ? 'Убрать из избранного' : 'Добавить в избранное'}
          title={fav ? 'В избранном' : 'Добавить в избранное'}
          style={{
            marginLeft: 'auto',
            width: 38,
            height: 38,
            display: 'grid',
            placeItems: 'center',
            background: fav ? 'var(--primary)' : 'var(--surface-secondary)',
            color: fav ? '#fff' : 'var(--text-secondary)',
            borderColor: fav ? 'var(--primary)' : 'var(--border)',
            boxShadow: fav ? '0 0 10px var(--primary-glow)' : undefined,
            borderRadius: 10,
            flexShrink: 0,
          }}
        >
          <Star
            size={17}
            strokeWidth={2.4}
            fill={fav ? 'currentColor' : 'none'}
            style={{
              transform: fav ? 'scale(1.05)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          />
        </button>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          minHeight: 38,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {site.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {site.tags?.map((t) => (
          <span
            key={t}
            className="badge-pill"
            style={{
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Actions Row */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
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
            fontSize: 13.5,
            padding: '10px 14px',
            borderRadius: 10,
            boxShadow: '0 0 12px var(--primary-glow)',
          }}
        >
          <Play size={15} strokeWidth={2.6} fill="currentColor" /> Открыть
        </button>
        <button
          onClick={() => openInExternalBrowser(site.url)}
          className="btn-brutal"
          title={`Открыть ${site.url} во внешнем браузере`}
          aria-label="Открыть во внешнем браузере"
          style={{
            width: 42,
            height: 42,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--surface-secondary)',
            color: 'var(--text-secondary)',
            borderRadius: 10,
            flexShrink: 0,
          }}
        >
          <ExternalLink size={16} strokeWidth={2.2} />
        </button>
      </div>
    </article>
  );
}
