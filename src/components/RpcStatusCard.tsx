import { useEffect, useState } from 'react';
import { CircleAlert, Loader2, MessageCircle, RefreshCw } from 'lucide-react';
import { getRpcStatus, onRpcStatusChange, type RpcStatusPayload } from '../services/discordRpc';

// Живой статус Discord Rich Presence: видно, подключено или нет — и почему.
export function RpcStatusCard() {
  const [status, setStatus] = useState<RpcStatusPayload | null>(null);

  const refresh = () => {
    getRpcStatus().then(setStatus);
  };

  useEffect(() => {
    refresh();
    const off = onRpcStatusChange(setStatus);
    const timer = setInterval(refresh, 5000);
    return () => {
      off();
      clearInterval(timer);
    };
  }, []);

  const state = status?.status ?? 'disconnected';
  const connected = state === 'connected';
  const busy = state === 'connecting';
  const dot = connected ? '#22c55e' : busy ? 'var(--primary)' : '#e5484d';

  return (
    <div className="brutal" style={{ background: 'var(--surface)', padding: 20 }}>
      <div style={{ fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <MessageCircle size={16} /> Discord Rich Presence
        <span
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 999, background: dot }} />
          {connected ? 'Подключено' : busy ? 'Подключение…' : state === 'unavailable' ? 'Только desktop' : state === 'error' ? 'Ошибка' : 'Ожидание Discord'}
        </span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
        {connected ? (
          <>Активность видна в профиле Discord и обновляется при смене раздела и сервиса.</>
        ) : (
          <>
            Чтобы активность появилась:
            <ol style={{ margin: '8px 0 0', paddingLeft: 18 }}>
              <li>Запустите Discord (десктопный) и включите «Отображать текущую активность» в настройках.</li>
              <li>AniDa сам переподключается каждые 10 секунд — ничего перезапускать не нужно.</li>
              <li>Application ID <code>{status?.clientId || '…'}</code> должен существовать на discord.com/developers.</li>
            </ol>
            {status?.error && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 10 }}>
                <CircleAlert size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ wordBreak: 'break-word' }}>{status.error}</span>
              </div>
            )}
          </>
        )}
      </div>
      <button
        onClick={refresh}
        className="btn-brutal"
        style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-secondary)', color: 'var(--text)', fontWeight: 800, fontSize: 13, padding: '10px 16px' }}
      >
        {busy ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={15} />}
        Обновить статус
      </button>
    </div>
  );
}
