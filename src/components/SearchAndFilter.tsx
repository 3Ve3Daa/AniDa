import { Search } from 'lucide-react';
import { CATEGORIES } from '../data/sites';
import { useApp } from '../store/useAppStore';

export function SearchAndFilter() {
  const { query, setQuery, activeCategory, setActiveCategory, favorites } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label
        className="brutal-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--surface)',
          padding: '10px 14px',
        }}
      >
        <Search size={18} color="var(--text-secondary)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по сервисам — название или описание…"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontSize: 14,
            fontWeight: 600,
          }}
        />
      </label>
      <div className="anida-category-row">
        {CATEGORIES.map((c) => {
          const active = activeCategory === c.id;
          const count =
            c.id === 'favorites'
              ? ` · ${favorites.length}`
              : '';
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className="btn-brutal"
              style={{
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 800,
                background: active ? 'var(--primary)' : 'var(--surface)',
                color: active ? '#fff' : 'var(--text)',
              }}
            >
              {c.label}
              {count}
            </button>
          );
        })}
      </div>
    </div>
  );
}
