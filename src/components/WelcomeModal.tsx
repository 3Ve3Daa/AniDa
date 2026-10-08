import { ArrowRight, MonitorPlay, Palette, Star } from 'lucide-react';
import { THEMES } from '../themes/themes';
import { useApp } from '../store/useAppStore';

export function WelcomeModal() {
  const { setTheme, theme, completeOnboarding } = useApp();
  return (
    <div
      className="anida-welcome-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 20,
      }}
    >
      <div className="brutal anida-welcome-sheet" style={{ background: 'var(--surface)', padding: 32, maxWidth: 560, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="brutal-sm" style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', background: 'var(--surface-secondary)', overflow: 'hidden', padding: 0, flexShrink: 0 }}>
            <img src="ava.png" alt="AniDa" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 24 }}>Добро пожаловать в AniDa</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
              Единый launcher для аниме-платформ
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <MonitorPlay size={17} style={{ flexShrink: 0, marginTop: 2 }} color="var(--primary)" />
            Открой AniDa вместо браузера и запускай любимые сервисы внутри приложения.
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Star size={17} style={{ flexShrink: 0, marginTop: 2 }} color="var(--primary)" />
            Добавляй платформы в избранное — история сохраняется локально.
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Palette size={17} style={{ flexShrink: 0, marginTop: 2 }} color="var(--primary)" />
            Выбери тему. По умолчанию — Black & Blue.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginTop: 18 }}>
          {THEMES.slice(0, 5).map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="btn-brutal"
              style={{
                padding: '8px 10px',
                fontSize: 12,
                fontWeight: 800,
                background: theme === t.id ? 'var(--primary)' : 'var(--surface-secondary)',
                color: theme === t.id ? '#fff' : 'var(--text)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={completeOnboarding}
          className="btn-brutal"
          style={{
            marginTop: 20,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 15,
            padding: '12px',
          }}
        >
          Перейти в главное меню <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
