import { Gamepad2, History, Home, LayoutGrid, Palette, Search, Settings, Star } from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { getRpcStatus, onRpcStatusChange, type RpcStatusPayload } from '../services/discordRpc';
import { useEffect, useState } from 'react';
import { THEMES } from '../themes/themes';

const NAV = [
  { route: 'home' as const, label: 'Главная', icon: Home },
  { route: 'catalog' as const, label: 'Каталог', icon: LayoutGrid },
  { route: 'favorites' as const, label: 'Избранное', icon: Star },
  { route: 'history' as const, label: 'История', icon: History },
  { route: 'games' as const, label: 'Игры', icon: Gamepad2 },
  { route: 'settings' as const, label: 'Настройки', icon: Settings },
];

// Десктопная верхняя панель: логотип слева, навигация по центру,
// поиск и тема справа. Работает в паре с левым сайдбаром.
export function TopBar() {
  const { route, go, theme, setTheme } = useApp();
  const [rpc, setRpc] = useState<RpcStatusPayload | null>(null);

  useEffect(() => {
    getRpcStatus().then(setRpc);
    return onRpcStatusChange(setRpc);
  }, []);

  const cycleTheme = () => {
    const i = THEMES.findIndex((t) => t.id === theme);
    setTheme(THEMES[(i + 1) % THEMES.length].id);
  };
  const themeMeta = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  const rpcOk = rpc?.status === 'connected';

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 24px',
        background: 'var(--background)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <button
        onClick={() => go({ name: 'home' })}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
          padding: 0,
        }}
        aria-label="AniDa — на главную"
      >
        <img src="ava.png" alt="AniDa" style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'cover', display: 'block' }} />
        <span style={{ fontWeight: 900, fontSize: 19, letterSpacing: 0.5 }}>AniDa</span>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'var(--text-muted)' }}>LAUNCHER</span>
      </button>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 2, margin: '0 auto' }} aria-label="Основная навигация">
        {NAV.map((item) => {
          const active = route.name !== 'site' && route.name === item.route;
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => go({ name: item.route })}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: active ? 'var(--surface-secondary)' : 'none',
                border: 'none',
                borderRadius: 9,
                color: active ? 'var(--text)' : 'var(--text-secondary)',
                fontWeight: active ? 800 : 600,
                fontSize: 13.5,
                padding: '8px 14px',
                cursor: 'pointer',
                transition: 'background var(--dur-fast) ease-out, color var(--dur-fast) ease-out',
              }}
            >
              <Icon size={15} strokeWidth={2.2} color={active ? 'var(--primary)' : 'currentColor'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          title={rpcOk ? 'Discord RPC подключён' : `Discord RPC: ${rpc?.status ?? '…'}`}
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: rpcOk ? '#22c55e' : 'var(--text-muted)',
          }}
        />
        <button
          onClick={() => go({ name: 'catalog' })}
          aria-label="Поиск по каталогу"
          style={{
            width: 36,
            height: 36,
            display: 'grid',
            placeItems: 'center',
            background: 'none',
            border: '1px solid transparent',
            borderRadius: 9,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <Search size={17} />
        </button>
        <button
          onClick={cycleTheme}
          title={`Тема: ${themeMeta.label} (нажми для смены)`}
          aria-label="Сменить тему"
          style={{
            height: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 9,
            color: 'var(--text)',
            fontWeight: 700,
            fontSize: 12.5,
            padding: '0 14px',
            cursor: 'pointer',
          }}
        >
          <Palette size={15} color="var(--primary)" />
          {themeMeta.label}
        </button>
      </div>
    </header>
  );
}
