import { ShieldCheck, ShieldOff } from 'lucide-react';
import { useApp } from '../store/useAppStore';

// Переключатель блокировки рекламы:
// desktop — режутся запросы к ad-хостам (main) + прячутся баннеры (CSS),
// mobile — прячутся баннерные контейнеры (сетевой резки в WebView-окне нет).
export function AdblockCard() {
  const { adblockEnabled, setAdblockEnabled } = useApp();
  const Icon = adblockEnabled ? ShieldCheck : ShieldOff;
  return (
    <div className="brutal" style={{ background: 'var(--surface)', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={17} color="var(--primary)" /> Блокировка рекламы
        </div>
        <button
          onClick={() => setAdblockEnabled(!adblockEnabled)}
          role="switch"
          aria-checked={adblockEnabled}
          className="btn-brutal"
          style={{
            marginLeft: 'auto',
            minWidth: 64,
            minHeight: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: adblockEnabled ? 'flex-end' : 'flex-start',
            padding: 4,
            background: adblockEnabled ? 'var(--primary)' : 'var(--surface-secondary)',
          }}
        >
          <span style={{ width: 26, height: 26, borderRadius: 999, background: '#fff' }} />
        </button>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.65 }}>
        {adblockEnabled
          ? 'Включена: баннеры режутся, кнопки «Пропустить» жмутся сами, видеореклама с меткой глушится и проматывается.'
          : 'Выключена: сайты грузятся как есть.'}
        <br />
        Честно: рекламу, встроенную сайтом в плеер без меток, убрать нельзя —
        она идёт с тех же серверов, что и видео.
      </div>
    </div>
  );
}
