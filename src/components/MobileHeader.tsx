import { Search } from 'lucide-react';
import { useApp } from '../store/useAppStore';

// Компактная верхняя панель телефона (§3): AniDa + поиск.
export function MobileHeader() {
  const { query, setQuery, go, route } = useApp();
  const showSearch = route.name === 'home' || route.name === 'catalog';
  return (
    <header
      style={{
        background: 'var(--surface)',
        borderBottom: '2px solid var(--border)',
        padding: '10px 12px calc(10px)',
        paddingTop: 'calc(10px + env(safe-area-inset-top))',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <button
        onClick={() => go({ name: 'home' })}
        aria-label="AniDa — на главную"
        style={{
          width: 44,
          height: 44,
          display: 'grid',
          placeItems: 'center',
          background: 'var(--surface-secondary)',
          overflow: 'hidden',
          padding: 0,
          border: '2px solid var(--border)',
          borderRadius: 10,
          boxShadow: '3px 3px 0 var(--shadow)',
          cursor: 'pointer',
          flexShrink: 0,
          touchAction: 'manipulation',
        }}
      >
        <img src="ava.png" alt="AniDa" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
            minHeight: 44,
          }}
        >
          <Search size={18} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск сервисов…"
            enterKeyHint="search"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: 16, // >=16px — без авто-зума iOS
              fontWeight: 600,
              minWidth: 0,
            }}
          />
        </label>
      ) : (
        <div style={{ fontWeight: 900, fontSize: 19 }}>AniDa</div>
      )}
    </header>
  );
}
