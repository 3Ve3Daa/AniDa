import {
  Flame,
  History,
  RotateCcw,
  Star,
  Tv,
  Compass,
} from 'lucide-react';
import { CATEGORIES } from '../data/sites';
import { useApp } from '../store/useAppStore';
import { HeroBanner } from '../components/HeroBanner';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { PosterCard, SiteCard } from '../components/SiteCard';

function useFilteredSites() {
  const { sites, query, activeCategory, favorites, history, sortOrder } = useApp();
  const q = query.trim().toLowerCase();
  const favSet = new Set(favorites);
  const lastSeen = new Map(history.map((h) => [h.siteId, h.openedAt]));

  return sites
    .filter((s) => {
      if (activeCategory === 'favorites' && !favSet.has(s.id)) return false;
      if (activeCategory !== 'all' && activeCategory !== 'favorites') {
        const cat = CATEGORIES.find((c) => c.id === activeCategory);
        if (cat && cat.match !== 'all' && cat.match !== 'favorites' && !s.category.includes(cat.match)) {
          return false;
        }
      }
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        s.tags?.some((t) => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'name') return a.name.localeCompare(b.name, 'ru');
      if (sortOrder === 'recent') return (lastSeen.get(b.id) ?? 0) - (lastSeen.get(a.id) ?? 0);
      // recommended: избранное выше, дальше featured
      const fav = Number(favSet.has(b.id)) - Number(favSet.has(a.id));
      if (fav !== 0) return fav;
      return Number(b.featured ?? false) - Number(a.featured ?? false);
    });
}

export function HomePage() {
  const { sites, go, favorites, history } = useApp();
  const popular = sites.filter((s) => s.featured);
  const recentIds = history.slice(0, 4).map((h) => h.siteId);
  const recent = sites.filter((s) => recentIds.includes(s.id));
  const favSites = sites.filter((s) => favorites.includes(s.id)).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }}>
      <HeroBanner />

      {/* Recently Opened */}
      {recent.length > 0 && (
        <Section
          title="Недавно открытые"
          icon={<History size={18} />}
          action={{ label: 'Вся история', onClick: () => go({ name: 'history' }) }}
        >
          <div className="anida-row">
            {recent.map((s) => (
              <PosterCard key={s.id} site={s} />
            ))}
          </div>
        </Section>
      )}

      {/* Featured / Popular */}
      <Section
        title="Популярные платформы"
        icon={<Flame size={18} />}
        action={{ label: 'Весь каталог', onClick: () => go({ name: 'catalog' }) }}
      >
        <div className="anida-card-grid">
          {popular.map((s) => (
            <SiteCard key={s.id} site={s} />
          ))}
        </div>
      </Section>

      {/* Favorites */}
      {favSites.length > 0 && (
        <Section
          title="Ваше избранное"
          icon={<Star size={18} />}
          action={{ label: 'Всё избранное', onClick: () => go({ name: 'favorites' }) }}
        >
          <div className="anida-card-grid">
            {favSites.map((s) => (
              <SiteCard key={s.id} site={s} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

export function CatalogPage() {
  const { setActiveCategory, setQuery, sites } = useApp();
  const filtered = useFilteredSites();

  const resetFilters = () => {
    setActiveCategory('all');
    setQuery('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 24 }}>
      {/* Title & Count Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: -0.3,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Compass size={24} color="var(--primary)" />
            Каталог платформ
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Выбери сайт для запуска во встроенном контейнере AniDa
          </div>
        </div>

        <span
          className="badge-pill"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: 12,
            padding: '5px 12px',
          }}
        >
          Показано: <b style={{ color: 'var(--primary)', marginLeft: 4 }}>{filtered.length}</b> / {sites.length}
        </span>
      </div>

      <SearchAndFilter />

      {/* Card Grid */}
      <div className="anida-card-grid">
        {filtered.map((s) => (
          <SiteCard key={s.id} site={s} />
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div
          className="brutal-sm"
          style={{
            background: 'var(--surface)',
            padding: 36,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            borderRadius: 14,
          }}
        >
          <div
            className="brutal-sm"
            style={{
              width: 52,
              height: 52,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--surface-secondary)',
              color: 'var(--primary)',
            }}
          >
            <Tv size={26} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>Ничего не найдено</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 360, lineHeight: 1.5 }}>
            По вашему запросу нет сервисов. Проверьте правильность написания или сбросьте фильтры.
          </div>
          <button
            onClick={resetFilters}
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--primary)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              padding: '9px 18px',
              borderRadius: 10,
              boxShadow: '0 0 12px var(--primary-glow)',
            }}
          >
            <RotateCcw size={15} /> Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
          paddingBottom: 6,
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, letterSpacing: -0.2 }}>{title}</h2>
        {action && (
          <button
            onClick={action.onClick}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {action.label} →
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
