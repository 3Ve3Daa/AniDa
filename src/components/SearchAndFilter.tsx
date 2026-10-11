import { useEffect, useRef } from 'react';
import {
  ArrowUpDown,
  BookOpen,
  Flame,
  LayoutGrid,
  Mic,
  Search,
  Sparkles,
  Star,
  Tv,
  X,
} from 'lucide-react';
import { CATEGORIES } from '../data/sites';
import { useApp, type SortOrder } from '../store/useAppStore';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  all: LayoutGrid,
  popular: Flame,
  favorites: Star,
  anime: Tv,
  manga: BookOpen,
  dub: Mic,
  new: Sparkles,
};

export function SearchAndFilter() {
  const { query, setQuery, activeCategory, setActiveCategory, favorites, sortOrder, setSortOrder } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  const SORTS: { id: SortOrder; label: string }[] = [
    { id: 'recommended', label: 'Сначала рекомендуемые' },
    { id: 'name', label: 'По названию А–Я' },
    { id: 'recent', label: 'Недавно открытые' },
  ];

  // Desktop keyboard shortcut: Ctrl+K / Cmd+K focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Search Bar */}
      <label
        className="brutal-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--surface)',
          padding: '10px 14px',
          borderRadius: 'var(--radius)',
        }}
      >
        <Search size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по платформам — название, теги, описание…"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontSize: 14.5,
            fontWeight: 600,
          }}
        />
        {query ? (
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
              padding: 2,
            }}
          >
            <X size={16} />
          </button>
        ) : (
          <kbd
            style={{
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '2px 7px',
              fontSize: 10.5,
              fontWeight: 700,
              color: 'var(--text-muted)',
              fontFamily: 'inherit',
            }}
          >
            Ctrl K
          </kbd>
        )}
      </label>

      {/* Categories Row + Sort */}
      <div className="anida-category-row">
        <label
          className="btn-brutal"
          title="Сортировка каталога"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '8px 12px',
            fontSize: 12.5,
            fontWeight: 700,
            background: 'var(--surface-secondary)',
            color: 'var(--text)',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <ArrowUpDown size={14} strokeWidth={2.4} style={{ color: 'var(--accent)' }} />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            aria-label="Сортировка каталога"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id} style={{ background: 'var(--surface)', color: 'var(--text)' }}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        {CATEGORIES.map((c) => {
          const active = activeCategory === c.id;
          const Icon = CATEGORY_ICONS[c.id] || LayoutGrid;
          const count = c.id === 'favorites' ? favorites.length : undefined;

          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className="btn-brutal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                fontSize: 12.5,
                fontWeight: 700,
                background: active ? 'var(--primary)' : 'var(--surface)',
                color: active ? '#fff' : 'var(--text)',
                borderColor: active ? 'var(--primary)' : 'var(--border)',
                boxShadow: active ? '0 0 12px var(--primary-glow)' : undefined,
                borderRadius: 999,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon
                size={14}
                strokeWidth={2.4}
                style={{
                  color: active ? '#fff' : 'var(--accent)',
                }}
              />
              <span>{c.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  style={{
                    background: active ? 'rgba(255,255,255,0.28)' : 'var(--surface-secondary)',
                    color: active ? '#fff' : 'var(--accent)',
                    borderRadius: 999,
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: '1px 6px',
                    marginLeft: 2,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
