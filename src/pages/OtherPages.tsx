import { Clock, Star, Trash2 } from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { SiteCard } from '../components/SiteCard';
import { formatTime } from '../utils/external';
import { ThemePicker } from '../components/ThemePicker';
import { RpcStatusCard } from '../components/RpcStatusCard';

export function FavoritesPage() {
  const { sites, favorites } = useApp();
  const list = sites.filter((s) => favorites.includes(s.id));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Star size={22} /> Избранное
      </h1>
      {list.length === 0 ? (
        <div className="brutal-sm" style={{ background: 'var(--surface)', padding: 28, textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Пока пусто. Нажмите на звезду в карточке сервиса, чтобы добавить его сюда.
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
  const { history, sites, clearHistory, openSite } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={22} /> История
        </h1>
        {history.length > 0 && (
          <button onClick={clearHistory} className="btn-brutal" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', color: 'var(--text)', fontWeight: 800, fontSize: 12, padding: '8px 12px' }}>
            <Trash2 size={14} /> Очистить историю
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="brutal-sm" style={{ background: 'var(--surface)', padding: 28, textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Вы ещё ничего не открывали. История появится после первого запуска сервиса.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map((h) => {
            const s = sites.find((x) => x.id === h.siteId);
            if (!s) return null;
            return (
              <button
                key={h.siteId + h.openedAt}
                onClick={() => openSite(s)}
                className="btn-brutal"
                style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', padding: '12px 14px', textAlign: 'left', color: 'var(--text)' }}
              >
                <span className="brutal-sm" style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', background: 'var(--surface-secondary)', fontWeight: 900, fontSize: 13, color: 'var(--primary)', flexShrink: 0 }}>
                  {s.logoText}
                </span>
                <span>
                  <span style={{ display: 'block', fontWeight: 800, fontSize: 14 }}>{s.name}</span>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {new URL(s.url).hostname} · {formatTime(h.openedAt)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SettingsPage() {
  const { clearHistory } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Настройки</h1>
      <div className="brutal" style={{ background: 'var(--surface)', padding: 20 }}>
        <ThemePicker />
      </div>
      <RpcStatusCard />
      <div className="brutal" style={{ background: 'var(--surface)', padding: 20 }}>
        <div style={{ fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trash2 size={16} /> Данные
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Избранное и история хранятся локально в этом приложении.
        </div>
        <button onClick={clearHistory} className="btn-brutal" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-secondary)', color: 'var(--text)', fontWeight: 800, fontSize: 13, padding: '10px 16px' }}>
          <Trash2 size={15} /> Очистить историю
        </button>
      </div>
      <div className="brutal" style={{ background: 'var(--surface)', padding: 20, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        <div style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>О приложении</div>
        AniDa v1.0.0 — единый desktop launcher для аниме-платформ. Стек: Electron + React + Vite +
        TypeScript. WebView через тег Electron webview, Discord Rich Presence через discord-rpc,
        иконки только lucide-react. Сборка Windows: <code>npm run electron:build</code>.
      </div>
    </div>
  );
}
