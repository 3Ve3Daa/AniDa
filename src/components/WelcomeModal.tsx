import { ArrowRight, Check, MonitorPlay, Palette, Sparkles, Star } from 'lucide-react';
import { THEMES } from '../themes/themes';
import { useApp } from '../store/useAppStore';

export function WelcomeModal() {
  const { setTheme, theme, completeOnboarding } = useApp();

  return (
    <div
      className="anida-welcome-backdrop anim-fade"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 4, 8, 0.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        className="brutal anida-welcome-sheet anim-pop"
        style={{
          background: 'var(--surface)',
          padding: 30,
          maxWidth: 580,
          width: '100%',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 24px var(--primary-glow)',
          border: '1.5px solid var(--border)',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            className="brutal-sm"
            style={{
              width: 58,
              height: 58,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--surface-secondary)',
              overflow: 'hidden',
              padding: 0,
              flexShrink: 0,
              borderRadius: 14,
              boxShadow: '0 0 16px var(--primary-glow)',
            }}
          >
            <img
              src="ava.png"
              alt="AniDa"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 900, fontSize: 23, letterSpacing: -0.3 }}>AniDa Launcher</span>
              <span
                className="badge-pill"
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: 10,
                }}
              >
                v1.1.0
              </span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, marginTop: 2 }}>
              Твой единый портал аниме-платформ для Desktop & Mobile
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginTop: 22,
            fontSize: 13.5,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            background: 'var(--surface-secondary)',
            padding: 16,
            borderRadius: 12,
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <MonitorPlay size={18} style={{ flexShrink: 0, marginTop: 2 }} color="var(--primary)" />
            <span>
              <b style={{ color: 'var(--text)' }}>Встроенный плеер:</b> запуск сайтов в изолированном
              контейнере без рекламы браузера и лишних вкладок.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Star size={18} style={{ flexShrink: 0, marginTop: 2 }} color="var(--primary)" />
            <span>
              <b style={{ color: 'var(--text)' }}>Избранное и история:</b> все ваши просмотры сохраняются
              локально и всегда под рукой.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Sparkles size={18} style={{ flexShrink: 0, marginTop: 2 }} color="var(--primary)" />
            <span>
              <b style={{ color: 'var(--text)' }}>Кроссплатформенность:</b> одинаково удобно на Windows,
              Android и iOS.
            </span>
          </div>
        </div>

        {/* Theme Quick Selector */}
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Palette size={14} color="var(--primary)" />
            <span>Выберите тему оформления:</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 8,
              maxHeight: 180,
              overflowY: 'auto',
              paddingRight: 4,
            }}
          >
            {THEMES.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className="btn-brutal"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                    background: active ? 'var(--primary)' : 'var(--surface-secondary)',
                    color: active ? '#fff' : 'var(--text)',
                    borderColor: active ? 'var(--primary)' : 'var(--border)',
                    boxShadow: active ? '0 0 10px var(--primary-glow)' : undefined,
                    borderRadius: 9,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      borderRadius: 4,
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.3)',
                    }}
                  >
                    <span style={{ width: 10, height: 14, background: t.swatch[0] }} />
                    <span style={{ width: 10, height: 14, background: t.swatch[1] }} />
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.label}
                  </span>
                  {active && <Check size={13} strokeWidth={3} style={{ marginLeft: 'auto' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={completeOnboarding}
          className="btn-brutal"
          style={{
            marginTop: 22,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 15,
            padding: '13px',
            borderRadius: 12,
            boxShadow: '0 0 18px var(--primary-glow)',
          }}
        >
          <span>Начать использование</span>
          <ArrowRight size={17} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
