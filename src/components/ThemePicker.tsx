import { Check, Palette } from 'lucide-react';
import { THEMES, type ThemeId } from '../themes/themes';
import { useApp } from '../store/useAppStore';

export function ThemePicker() {
  const { theme, setTheme, customColors, setCustomColors } = useApp();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, marginBottom: 12 }}>
        <Palette size={17} /> Тема оформления
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
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
                gap: 10,
                padding: 10,
                background: active ? 'var(--primary)' : 'var(--surface)',
                color: active ? '#fff' : 'var(--text)',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <span style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '2px solid rgba(0,0,0,.4)' }}>
                <span style={{ width: 18, height: 18, background: t.swatch[0] }} />
                <span style={{ width: 18, height: 18, background: t.swatch[1] }} />
              </span>
              {t.label}
              {active && <Check size={15} style={{ marginLeft: 'auto' }} />}
            </button>
          );
        })}
      </div>
      {theme === 'custom' && (
        <div className="brutal-sm" style={{ marginTop: 12, background: 'var(--surface)', padding: 14, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {(
            [
              ['bg', 'Фон'],
              ['surface', 'Поверхность'],
              ['surface2', 'Вторичная'],
              ['primary', 'Акцент'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 700 }}>
              {label}
              <input
                type="color"
                value={customColors[key as keyof typeof customColors] as string}
                onChange={(e) =>
                  setCustomColors({ ...customColors, [key]: e.target.value } as typeof customColors)
                }
                style={{ width: 64, height: 36, border: '2px solid var(--border)', borderRadius: 8, cursor: 'pointer', background: 'none', padding: 2 }}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function setThemeId(id: ThemeId) {
  document.documentElement.setAttribute('data-theme', id);
}
