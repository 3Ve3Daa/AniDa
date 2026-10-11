import { Gamepad2, History, Home, LayoutGrid, Settings, Star } from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { useIsMobile } from '../services/platform';

const TABS = [
  { route: 'home' as const, label: 'Главная', icon: Home },
  { route: 'catalog' as const, label: 'Каталог', icon: LayoutGrid },
  { route: 'favorites' as const, label: 'Избранное', icon: Star },
  { route: 'history' as const, label: 'История', icon: History },
  { route: 'settings' as const, label: 'Настройки', icon: Settings },
];

// Игры — только мобильный раздел (по ТЗ): таб виден лишь на телефоне.
const GAMES_TAB = { route: 'games' as const, label: 'Игры', icon: Gamepad2 };

export function BottomNav() {
  const { route, go, favorites } = useApp();
  const isMobileLayout = useIsMobile();
  const tabs = isMobileLayout ? [...TABS, GAMES_TAB] : TABS;

  return (
    <nav
      aria-label="Основная мобильная навигация"
      className="glass-panel"
      style={{
        display: 'flex',
        background: 'var(--surface-glass)',
        borderTop: '1.5px solid var(--border)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2px)',
        zIndex: 40,
        position: 'relative',
      }}
    >
      {tabs.map((t) => {
        const active = route.name === t.route || (route.name === 'site' && t.route === 'catalog');
        const Icon = t.icon;
        const hasFavBadge = t.route === 'favorites' && favorites.length > 0;

        return (
          <button
            key={t.route}
            onClick={() => go({ name: t.route })}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              minHeight: 58,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: 'transparent',
              color: active ? 'var(--primary)' : 'var(--text-secondary)',
              border: 'none',
              fontWeight: 800,
              fontSize: 11,
              cursor: 'pointer',
              touchAction: 'manipulation',
              position: 'relative',
              transition: 'color 0.15s ease, transform 0.1s ease',
              padding: '6px 0',
            }}
          >
            {active && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '36%',
                  height: 3,
                  borderRadius: '0 0 4px 4px',
                  background: 'var(--primary)',
                  boxShadow: '0 2px 8px var(--primary-glow)',
                }}
              />
            )}
            <div style={{ position: 'relative' }}>
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                style={{
                  color: active ? 'var(--primary)' : 'currentColor',
                  filter: active ? 'drop-shadow(0 0 6px var(--primary-glow))' : 'none',
                  transition: 'transform 0.15s ease',
                  transform: active ? 'scale(1.08)' : 'scale(1)',
                }}
              />
              {hasFavBadge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -9,
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 900,
                    borderRadius: 999,
                    minWidth: 15,
                    height: 15,
                    padding: '0 3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 6px var(--primary-glow)',
                  }}
                >
                  {favorites.length}
                </span>
              )}
            </div>
            <span style={{ letterSpacing: 0.2 }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
