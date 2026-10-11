import { useState, type ReactNode } from 'react';
import {
  Clock,
  Dices,
  ExternalLink,
  Info,
  LayoutGrid,
  Play,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { SiteCard } from '../components/SiteCard';
import { formatTime } from '../utils/external';
import { ThemePicker } from '../components/ThemePicker';
import { AdblockCard } from '../components/AdblockCard';
import { RpcStatusCard } from '../components/RpcStatusCard';
import { getPlatform } from '../services/platform';

export function FavoritesPage() {
  const { sites, favorites, go, openSite } = useApp();
  const list = sites.filter((s) => favorites.includes(s.id));

  const launchRandom = () => {
    if (list.length === 0) return;
    const randomSite = list[Math.floor(Math.random() * list.length)];
    openSite(randomSite);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
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
            <Star size={24} color="var(--primary)" fill="var(--primary)" />
            Избранные сервисы
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Быстрый доступ к вашим любимым платформам
          </div>
        </div>

        {list.length > 0 && (
          <button
            onClick={launchRandom}
            className="btn-brutal"
            title="Запустить случайный сервис из избранного"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: 13,
              fontWeight: 800,
              padding: '9px 16px',
              borderRadius: 10,
            }}
          >
            <Dices size={16} color="var(--primary)" /> Случайный выбор
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {list.length === 0 ? (
        <div
          className="brutal-sm"
          style={{
            background: 'var(--surface)',
            padding: 42,
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
              width: 56,
              height: 56,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--surface-secondary)',
              color: 'var(--primary)',
            }}
          >
            <Star size={28} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>В избранном пока пусто</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 380, lineHeight: 1.55 }}>
            Нажмите на звёздочку в карточке любого сервиса в каталоге, чтобы он появился здесь.
          </div>
          <button
            onClick={() => go({ name: 'catalog' })}
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--primary)',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 800,
              padding: '10px 20px',
              borderRadius: 10,
              boxShadow: '0 0 12px var(--primary-glow)',
            }}
          >
            <LayoutGrid size={16} /> Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="anida-card-grid">
          {list.map((s) => (
            <SiteCard key={s.id} site={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export function HistoryPage() {
  const { history, sites, clearHistory, openSite, go } = useApp();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    clearHistory();
    setConfirmClear(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
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
            <Clock size={24} color="var(--primary)" />
            История запусков
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Последние 30 открытых сайтов сохраняются локально
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: confirmClear ? '#ef4444' : 'var(--surface)',
              color: confirmClear ? '#fff' : 'var(--text)',
              borderColor: confirmClear ? '#ef4444' : 'var(--border)',
              fontWeight: 800,
              fontSize: 12.5,
              padding: '8px 14px',
              borderRadius: 10,
              transition: 'all 0.15s ease',
            }}
          >
            <Trash2 size={14} />
            {confirmClear ? 'Точно очистить?' : 'Очистить историю'}
          </button>
        )}
      </div>

      {/* History List or Empty */}
      {history.length === 0 ? (
        <div
          className="brutal-sm"
          style={{
            background: 'var(--surface)',
            padding: 42,
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
              width: 56,
              height: 56,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--surface-secondary)',
              color: 'var(--primary)',
            }}
          >
            <Clock size={28} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>История чиста</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 360, lineHeight: 1.5 }}>
            Вы ещё ничего не запускали. Выберите платформу в каталоге, и она появится здесь.
          </div>
          <button
            onClick={() => go({ name: 'catalog' })}
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--primary)',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 800,
              padding: '10px 20px',
              borderRadius: 10,
              boxShadow: '0 0 12px var(--primary-glow)',
            }}
          >
            <LayoutGrid size={16} /> Выбрать сервис
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map((h, idx) => {
            const s = sites.find((x) => x.id === h.siteId);
            if (!s) return null;
            return (
              <div
                key={h.siteId + h.openedAt + idx}
                className="brutal card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: 'var(--surface)',
                  padding: '12px 16px',
                  borderRadius: 12,
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
                    fontWeight: 900,
                    fontSize: 14,
                    color: 'var(--primary)',
                    borderRadius: 10,
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {s.logo ? (
                    <img
                      src={s.logo}
                      alt={s.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    s.logoText
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>
                    {s.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 2,
                    }}
                  >
                    <span>{new URL(s.url).hostname}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--accent)' }}>{formatTime(h.openedAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => openSite(s)}
                  className="btn-brutal"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'var(--primary)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 12.5,
                    padding: '8px 14px',
                    borderRadius: 8,
                    boxShadow: '0 0 10px var(--primary-glow)',
                  }}
                >
                  <Play size={13} fill="currentColor" /> Открыть
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SettingsSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="brutal anim-card" style={{ background: 'var(--surface)', padding: 22, borderRadius: 16 }}>
      <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function SettingsPage() {
  const { clearHistory, sites, favorites, history } = useApp();
  const [clearedNotice, setClearedNotice] = useState(false);
  const platform = getPlatform();

  const handleClearHistory = () => {
    clearHistory();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 840, paddingBottom: 32 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: -0.3 }}>
          Настройки AniDa
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Персонализация, интеграции и управление данными приложения
        </div>
      </div>

      {/* Theme Picker Section */}
      <SettingsSection title="Оформление">
        <ThemePicker />
      </SettingsSection>

      {/* Discord RPC Status */}
      <RpcStatusCard />
      <AdblockCard />

      {/* Storage and Data Section */}
      <div className="brutal" style={{ background: 'var(--surface)', padding: 22, borderRadius: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trash2 size={18} color="var(--primary)" /> Локальные данные
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
          Вся ваша история и избранное хранятся локально на вашем устройстве без сторонних серверов.
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div
            className="brutal-sm"
            style={{
              background: 'var(--surface-secondary)',
              padding: '10px 16px',
              borderRadius: 10,
              fontSize: 12,
            }}
          >
            Избранных сервисов: <b style={{ color: 'var(--primary)' }}>{favorites.length}</b>
          </div>
          <div
            className="brutal-sm"
            style={{
              background: 'var(--surface-secondary)',
              padding: '10px 16px',
              borderRadius: 10,
              fontSize: 12,
            }}
          >
            Записей в истории: <b style={{ color: 'var(--primary)' }}>{history.length}</b>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleClearHistory}
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--surface-secondary)',
              color: 'var(--text)',
              fontWeight: 800,
              fontSize: 13,
              padding: '10px 18px',
              borderRadius: 10,
            }}
          >
            <Trash2 size={15} /> Очистить историю
          </button>
          {clearedNotice && (
            <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>
              ✓ История успешно очищена
            </span>
          )}
        </div>
      </div>

      {/* App Info & Platform */}
      <div
        className="brutal"
        style={{
          background: 'var(--surface)',
          padding: 22,
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          borderRadius: 16,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            color: 'var(--text)',
            fontSize: 16,
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Info size={18} color="var(--primary)" /> О лаунчере AniDa
        </div>

        <p style={{ margin: '0 0 14px' }}>
          <b>AniDa v1.1.0</b> — высокоскоростной кроссплатформенный лаунчер аниме-платформ.
          Предоставляет изолированный просмотр, каталог, фильтрацию и избранное без лишних
          вкладок и рекламы в браузере.
        </p>

        {/* Tech Badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span
            className="badge-pill"
            style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Платформа: <b style={{ color: 'var(--accent)', marginLeft: 4 }}>{platform.toUpperCase()}</b>
          </span>
          <span
            className="badge-pill"
            style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            React 18 + TypeScript
          </span>
          <span
            className="badge-pill"
            style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Electron 36 (Desktop)
          </span>
          <span
            className="badge-pill"
            style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Capacitor 6 (Android / iOS)
          </span>
          <span
            className="badge-pill"
            style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Discord RPC v4
          </span>
        </div>
      </div>
    </div>
  );
}
