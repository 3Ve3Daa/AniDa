import { History, Home, LayoutGrid, Settings, Star } from 'lucide-react';
import { useApp } from '../store/useAppStore';

const TABS = [
  { route: 'home' as const, label: 'Главная', icon: Home },
  { route: 'catalog' as const, label: 'Каталог', icon: LayoutGrid },
  { route: 'favorites' as const, label: 'Избранное', icon: Star },
  { route: 'history' as const, label: 'История', icon: History },
  { route: 'settings' as const, label: 'Настройки', icon: Settings },
];

// Нижняя навигация для mobile (§3): 5 табов, touch target >= 56px, без hover-зависимостей.
export function BottomNav() {
  const { route, go } = useApp();
  return (
    <nav
      aria-label="Основная навигация"
      style={{
        display: 'flex',
        background: 'var(--surface)',
        borderTop: '2px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map((t) => {
        const active = route.name === t.route || (route.name === 'site' && t.route === 'catalog');
        const Icon = t.icon;
        return (
          <button
            key={t.route}
            onClick={() => go({ name: t.route })}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              minHeight: 60,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              background: active ? 'var(--surface-secondary)' : 'transparent',
              color: active ? 'var(--primary)' : 'var(--text-secondary)',
              border: 'none',
              borderTop: active ? '3px solid var(--primary)' : '3px solid transparent',
              fontWeight: 800,
              fontSize: 10.5,
              cursor: 'pointer',
              touchAction: 'manipulation',
            }}
          >
            <Icon size={21} strokeWidth={2.2} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
