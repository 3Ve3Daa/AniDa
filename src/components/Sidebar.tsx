import { useEffect, useState } from 'react';
import { History, Home, LayoutGrid, MessageSquare, Palette, Settings, Star } from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { getRpcStatus, onRpcStatusChange, type RpcStatusPayload } from '../services/discordRpc';
import { isDesktop } from '../services/platform';
import { THEMES } from '../themes/themes';

const NAV = [
  { route: 'home' as const, label: 'Главная', icon: Home },
  { route: 'catalog' as const, label: 'Каталог', icon: LayoutGrid },
  { route: 'favorites' as const, label: 'Избранное', icon: Star },
  { route: 'history' as const, label: 'История', icon: History },
  { route: 'settings' as const, label: 'Настройки', icon: Settings },
];

export function Sidebar() {
  const { route, go, favorites, sites, theme, setTheme } = useApp();
  const [rpcStatus, setRpcStatus] = useState<RpcStatusPayload | null>(null);

  useEffect(() => {
    getRpcStatus().then(setRpcStatus);
    const off = onRpcStatusChange(setRpcStatus);
    return () => off();
  }, []);

  const isElectron = isDesktop();
  const isRpcConnected = rpcStatus?.status === 'connected';
  const isRpcConnecting = rpcStatus?.status === 'connecting';

  // Quick theme switcher cycle
  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex].id);
  };

  const currentThemeMeta = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <aside
      className="glass-panel anida-sidebar"
      style={{
        width: 248,
        background: 'var(--surface)',
        borderRight: '1.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 14px',
        gap: 14,
        zIndex: 10,
        position: 'relative',
      }}
    >
      {/* Brand Header */}
      <div
        className="sb-brand"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '4px 6px 14px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="brutal-sm"
          style={{
            width: 44,
            height: 44,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--surface-secondary)',
            overflow: 'hidden',
            padding: 0,
            flexShrink: 0,
            boxShadow: '0 0 12px var(--primary-glow)',
          }}
        >
          <img
            src="ava.png"
            alt="AniDa"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div className="sb-label" style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.3, lineHeight: 1.1 }}>
              AniDa
            </span>
            <span
              className="badge-pill sb-badge"
              style={{
                background: 'var(--primary-glow)',
                color: 'var(--accent)',
                border: '1px solid var(--primary)',
                fontSize: 9.5,
                padding: '1px 6px',
              }}
            >
              LAUNCHER
            </span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-secondary)',
              fontWeight: 600,
              marginTop: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: 'var(--primary)',
                boxShadow: '0 0 6px var(--primary)',
              }}
            />
            {sites.length} сервисов в каталоге
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {NAV.map((item) => {
          const active = route.name !== 'site' && route.name === item.route;
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => go({ name: item.route })}
              className="btn-brutal sb-nav-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                fontWeight: 700,
                fontSize: 13.5,
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? '#fff' : 'var(--text)',
                borderColor: active ? 'var(--primary)' : 'transparent',
                boxShadow: active ? '0 0 14px var(--primary-glow)' : 'none',
                textAlign: 'left',
                borderRadius: 10,
              }}
            >
              <Icon
                size={18}
                strokeWidth={2.3}
                style={{
                  color: active ? '#fff' : 'var(--accent)',
                  flexShrink: 0,
                }}
              />
              <span className="sb-label" style={{ flex: 1 }}>{item.label}</span>
              {item.route === 'favorites' && favorites.length > 0 && (
                <span
                  className="sb-badge"
                  style={{
                    background: active ? 'rgba(255,255,255,.28)' : 'var(--surface-secondary)',
                    color: active ? '#fff' : 'var(--accent)',
                    border: active ? 'none' : '1px solid var(--border)',
                    fontSize: 11,
                    fontWeight: 800,
                    borderRadius: 999,
                    padding: '1px 7px',
                    marginLeft: 'auto',
                  }}
                >
                  {favorites.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Widgets */}
      <div className="sb-footer" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Quick Theme Button */}
        <button
          onClick={cycleTheme}
          className="btn-brutal"
          title={`Текущая тема: ${currentThemeMeta.label}. Нажмите для быстрой смены`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            background: 'var(--surface-secondary)',
            color: 'var(--text)',
            fontSize: 12,
            fontWeight: 700,
            borderRadius: 10,
          }}
        >
          <span
            style={{
              display: 'flex',
              borderRadius: 6,
              overflow: 'hidden',
              border: '1.5px solid var(--border)',
              flexShrink: 0,
            }}
          >
            <span style={{ width: 10, height: 16, background: currentThemeMeta.swatch[0] }} />
            <span style={{ width: 10, height: 16, background: currentThemeMeta.swatch[1] }} />
          </span>
          <span className="sb-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, textAlign: 'left' }}>
            {currentThemeMeta.label}
          </span>
          <Palette size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
        </button>

        {/* Discord RPC / Platform Card */}
        <div
          onClick={() => go({ name: 'settings' })}
          className="brutal-sm sb-rpc"
          style={{
            background: 'var(--surface-secondary)',
            padding: '10px 12px',
            fontSize: 11.5,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            lineHeight: 1.45,
            borderRadius: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 4,
              fontSize: 12,
            }}
          >
            <MessageSquare size={13} color="var(--primary)" />
            <span>Discord RPC</span>
            <span
              style={{
                marginLeft: 'auto',
                width: 8,
                height: 8,
                borderRadius: 999,
                background: isRpcConnected ? '#22c55e' : isRpcConnecting ? 'var(--primary)' : '#64748b',
                boxShadow: isRpcConnected ? '0 0 8px #22c55e' : isRpcConnecting ? '0 0 8px var(--primary)' : 'none',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {isElectron
              ? isRpcConnected
                ? 'Активность транслируется'
                : 'Автоподключение каждые 10с'
              : 'Desktop режим готов'}
          </div>
        </div>
      </div>
    </aside>
  );
}
