import { Check, Flame, Palette, Play, RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { CUSTOM_PRESETS, THEMES, type CustomPreset, type ThemeId } from '../themes/themes';
import { useApp } from '../store/useAppStore';

export function ThemePicker() {
  const { theme, setTheme, customColors, setCustomColors } = useApp();

  const applyPreset = (preset: CustomPreset) => {
    setCustomColors({
      bg: preset.bg,
      surface: preset.surface,
      surface2: preset.surface2,
      primary: preset.primary,
    });
  };

  const resetCustom = () => {
    setCustomColors({
      bg: '#060913',
      surface: '#0e1528',
      surface2: '#16203a',
      primary: '#3b82f6',
    });
  };

  const activeThemeMeta = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            className="brutal-sm"
            style={{
              width: 34,
              height: 34,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--primary)',
              color: '#fff',
            }}
          >
            <Palette size={18} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Темы оформления</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              10 стилизованных аниме-палитр с поддержкой Design Tokens
            </div>
          </div>
        </div>
        <span
          className="badge-pill"
          style={{
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--accent)',
            fontSize: 11,
          }}
        >
          {activeThemeMeta.label}
        </span>
      </div>

      {/* Live Mini Preview Banner */}
      <div
        className="brutal-sm"
        style={{
          background: 'var(--surface-secondary)',
          border: '1.5px solid var(--border)',
          padding: 14,
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
            <Sparkles size={14} color="var(--primary)" />
            <span>Живой предпросмотр темы: {activeThemeMeta.label}</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {activeThemeMeta.tagline}
          </span>
        </div>

        {/* Mock card preview */}
        <div
          className="brutal-sm"
          style={{
            background: 'var(--surface)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderRadius: 10,
          }}
        >
          <div
            className="brutal-sm"
            style={{
              width: 40,
              height: 40,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--surface-secondary)',
              color: 'var(--primary)',
              fontWeight: 900,
              fontSize: 16,
              borderRadius: 8,
              boxShadow: '0 0 10px var(--primary-glow)',
            }}
          >
            AD
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 14 }}>AniDa Cyber Preview</span>
              <span
                className="badge-pill"
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: 10,
                  padding: '1px 6px',
                }}
              >
                <Flame size={10} /> ТОП
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              Текст интерфейса, акценты и свечение кнопок
            </div>
          </div>
          <button
            className="btn-brutal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--primary)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              padding: '8px 14px',
              borderRadius: 8,
              boxShadow: '0 0 10px var(--primary-glow)',
            }}
          >
            <Play size={13} fill="currentColor" /> Запуск
          </button>
        </div>
      </div>

      {/* Themes Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 10,
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
                flexDirection: 'column',
                gap: 8,
                padding: '12px 14px',
                background: active ? 'var(--surface-secondary)' : 'var(--surface)',
                color: 'var(--text)',
                borderColor: active ? 'var(--primary)' : 'var(--border)',
                boxShadow: active ? '0 0 14px var(--primary-glow), 2px 2px 0 var(--shadow)' : undefined,
                textAlign: 'left',
                borderRadius: 12,
                position: 'relative',
              }}
            >
              {/* Header inside button */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8 }}>
                {/* 3-color palette swatch preview */}
                <span
                  style={{
                    display: 'flex',
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: '1.5px solid var(--border)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ width: 14, height: 20, background: t.swatch[0] }} />
                  <span style={{ width: 14, height: 20, background: t.swatch[2] || t.swatch[0] }} />
                  <span style={{ width: 14, height: 20, background: t.swatch[1] }} />
                </span>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: active ? 'var(--accent)' : 'var(--text)' }}>
                    {t.label}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t.tagline.split('•')[0].trim()}
                  </div>
                </div>

                {active && (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      background: 'var(--primary)',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      boxShadow: '0 0 8px var(--primary-glow)',
                    }}
                  >
                    <Check size={13} strokeWidth={3} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Theme Studio Controls */}
      {theme === 'custom' && (
        <div
          className="brutal-sm"
          style={{
            background: 'var(--surface-secondary)',
            padding: 18,
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 800, fontSize: 13.5 }}>
              <Wand2 size={16} color="var(--primary)" />
              <span>Палитра Custom Studio</span>
            </div>
            <button
              onClick={resetCustom}
              className="btn-brutal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
                fontSize: 11.5,
                fontWeight: 700,
                padding: '6px 10px',
                borderRadius: 8,
              }}
            >
              <RotateCcw size={12} /> Сброс к дефолту
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
              Быстрые пресеты:
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CUSTOM_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="btn-brutal"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: p.primary,
                      boxShadow: `0 0 6px ${p.primary}`,
                    }}
                  />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 12,
            }}
          >
            {(
              [
                ['bg', 'Фон приложения', customColors.bg],
                ['surface', 'Карточки и панели', customColors.surface],
                ['surface2', 'Вторичные блоки', customColors.surface2],
                ['primary', 'Главный акцент', customColors.primary],
              ] as const
            ).map(([key, label, val]) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'var(--surface)',
                  padding: 10,
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="color"
                    value={val}
                    onChange={(e) =>
                      setCustomColors({ ...customColors, [key]: e.target.value })
                    }
                    style={{
                      width: 36,
                      height: 36,
                      border: '2px solid var(--border)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: 'none',
                      padding: 2,
                    }}
                  />
                  <code style={{ fontSize: 11, color: 'var(--text-muted)' }}>{val}</code>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function setThemeId(id: ThemeId) {
  document.documentElement.setAttribute('data-theme', id);
}
