import { History, Home, LayoutGrid, Settings, Star } from 'lucide-react';
import { useApp } from '../store/useAppStore';

const NAV = [
  { route: 'home' as const, label: 'Главная', icon: Home },
  { route: 'catalog' as const, label: 'Каталог', icon: LayoutGrid },
  { route: 'favorites' as const, label: 'Избранное', icon: Star },
  { route: 'history' as const, label: 'История', icon: History },
  { route: 'settings' as const, label: 'Настройки', icon: Settings },
];

export function Sidebar() {
  const { route, go, favorites } = useApp();
  return (
    <aside
      style={{
        width: 232,
        background: 'var(--surface)',
        borderRight: '2px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px 12px' }}>
        <div
          className="brutal-sm"
          style={{
            width: 40,
            height: 40,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--surface-secondary)',
            overflow: 'hidden',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <img src="ava.png" alt="AniDa" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 20, lineHeight: 1 }}>AniDa</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>
            anime launcher
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {NAV.map((item) => {
          const active = route.name !== 'site' && route.name === item.route;
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => go({ name: item.route })}
              className="btn-brutal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                fontWeight: 700,
                fontSize: 14,
                background: active ? 'var(--primary)' : 'var(--surface-secondary)',
                color: active ? '#fff' : 'var(--text)',
                textAlign: 'left',
              }}
            >
              <Icon size={18} strokeWidth={2.2} />
              {item.label}
              {item.route === 'favorites' && favorites.length > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: active ? 'rgba(255,255,255,.25)' : 'var(--primary)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 800,
                    borderRadius: 999,
                    padding: '2px 8px',
                  }}
                >
                  {favorites.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div
        className="brutal-sm"
        style={{
          marginTop: 'auto',
          background: 'var(--surface-secondary)',
          padding: 12,
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 4, fontSize: 12 }}>
          Discord RPC активен
        </div>
        Статус обновляется при смене раздела и сервиса.
      </div>
    </aside>
  );
}
