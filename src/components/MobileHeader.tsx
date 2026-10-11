import { Palette, Search, X } from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { THEMES } from '../themes/themes';

export function MobileHeader() {
  const { query, setQuery, go, route, theme, setTheme } = useApp();
  const showSearch = route.name === 'home' || route.name === 'catalog';

  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex].id);
  };

  return (
    <header
      className="glass-panel"
      style={{
        background: 'var(--surface-glass)',
        borderBottom: '1.5px solid var(--border)',
        padding: '8px 12px',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 30,
        position: 'relative',
      }}
    >
      <button
        onClick={() => {
          setQuery('');
          go({ name: 'home' });
        }}
        aria-label="AniDa — на главную"
        className="btn-brutal"
        style={{
          width: 42,
          height: 42,
          display: 'grid',
          placeItems: 'center',
          background: 'var(--surface-secondary)',
          overflow: 'hidden',
          padding: 0,
          borderRadius: 10,
          boxShadow: '0 0 10px var(--primary-glow)',
          flexShrink: 0,
        }}
      >
        <img
          src="ava.png"
          alt="AniDa"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </button>

      {showSearch ? (
        <label
          className="brutal-sm"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--background)',
            padding: '0 12px',
            minHeight: 42,
            borderRadius: 10,
          }}
        >
          <Search size={17} color="var(--primary)" style={{ flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск платформ…"
            enterKeyHint="search"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: 15,
              fontWeight: 600,
              minWidth: 0,
            }}
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Очистить поиск"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                padding: 4,
              }}
            >
              <X size={16} />
            </button>
          )}
        </label>
      ) : (
        <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.2 }}>AniDa</div>
      )}

      {/* Quick Theme Trigger for Mobile */}
      <button
        type="button"
        onClick={cycleTheme}
        aria-label="Сменить тему"
        title="Быстрая смена темы"
        className="btn-brutal"
        style={{
          width: 42,
          height: 42,
          display: 'grid',
          placeItems: 'center',
          background: 'var(--surface-secondary)',
          color: 'var(--primary)',
          borderRadius: 10,
          flexShrink: 0,
        }}
      >
        <Palette size={18} strokeWidth={2.3} />
      </button>
    </header>
  );
}
