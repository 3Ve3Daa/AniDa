import { Flame, History, LayoutGrid, Star } from 'lucide-react';
import { CATEGORIES } from '../data/sites';
import { useApp } from '../store/useAppStore';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { SiteCard } from '../components/SiteCard';

function useFilteredSites() {
  const { sites, query, activeCategory, favorites } = useApp();
  const q = query.trim().toLowerCase();
  const favSet = new Set(favorites);
  return sites
    .filter((s) => {
      if (activeCategory === 'favorites' && !favSet.has(s.id)) return false;
      if (activeCategory !== 'all' && activeCategory !== 'favorites') {
        const cat = CATEGORIES.find((c) => c.id === activeCategory);
        if (cat && cat.match !== 'all' && cat.match !== 'favorites' && !s.category.includes(cat.match)) return false;
      }
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q)
      );
    })
    // §10: избранные сайты отображаются выше остальных
    .sort((a, b) => Number(favSet.has(b.id)) - Number(favSet.has(a.id)));
}

export function HomePage() {
  const { sites, go, openSite, favorites, history } = useApp();
  const popular = sites.filter((s) => s.featured);
  const recentIds = history.slice(0, 3).map((h) => h.siteId);
  const recent = sites.filter((s) => recentIds.includes(s.id));
  const favSites = sites.filter((s) => favorites.includes(s.id)).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section className="brutal anida-hero" style={{ background: 'var(--primary)', color: '#fff', padding: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.85 }}>
          Launcher · Windows / macOS / Linux · Android / iOS
        </div>
        <h1 style={{ margin: '8px 0 6px', fontWeight: 900 }}>Открыл AniDa — выбрал сервис</h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: 14, fontWeight: 600 }}>
          Каталог любимых аниме-платформ. Сервис открывается внутри приложения, без браузера.
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
          <button onClick={() => go({ name: 'catalog' })} className="btn-brutal" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0b1a33', fontWeight: 800, padding: '10px 18px', fontSize: 14 }}>
            <LayoutGrid size={16} /> Открыть каталог
          </button>
          <button onClick={() => popular[0] && openSite(popular[0])} className="btn-brutal" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,.35)', color: '#fff', fontWeight: 800, padding: '10px 18px', fontSize: 14 }}>
            <Flame size={16} /> Популярное: {popular[0]?.name}
          </button>
        </div>
      </section>

      {recent.length > 0 && (
        <Section title="Недавно открытые" icon={<History size={17} />} action={{ label: 'Вся история', onClick: () => go({ name: 'history' }) }}>
          <div className="anida-card-grid">
            {recent.map((s) => (
              <SiteCard key={s.id} site={s} />
            ))}
          </div>
        </Section>
      )}

      <Section title="Популярные сервисы" icon={<Flame size={17} />} action={{ label: 'Весь каталог', onClick: () => go({ name: 'catalog' }) }}>
        <div className="anida-card-grid">
          {popular.map((s) => (
            <SiteCard key={s.id} site={s} />
          ))}
        </div>
      </Section>

      {favSites.length > 0 && (
        <Section title="Избранное" icon={<Star size={17} />} action={{ label: 'Всё избранное', onClick: () => go({ name: 'favorites' }) }}>
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
  const filtered = useFilteredSites();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Каталог платформ</h1>
      <SearchAndFilter />
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
        Найдено: {filtered.length}
      </div>
      <div className="anida-card-grid">
        {filtered.map((s) => (
          <SiteCard key={s.id} site={s} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="brutal-sm" style={{ background: 'var(--surface)', padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Ничего не найдено. Попробуйте другой запрос или категорию.
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ color: 'var(--primary)' }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{title}</h2>
        {action && (
          <button
            onClick={action.onClick}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
          >
            {action.label} →
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
