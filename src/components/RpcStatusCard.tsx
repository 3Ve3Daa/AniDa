import { useEffect, useState } from 'react';
import { CircleAlert, Loader2, MessageSquare, RefreshCw } from 'lucide-react';
import { getRpcStatus, onRpcStatusChange, type RpcStatusPayload } from '../services/discordRpc';

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
  const dot = connected ? '#22c55e' : busy ? 'var(--primary)' : '#ef4444';

  return (
    <div className="brutal" style={{ background: 'var(--surface)', padding: 22, borderRadius: 16 }}>
      {/* Title & Status LED */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 16 }}>
          <MessageSquare size={18} color="var(--primary)" />
          <span>Discord Rich Presence</span>
        </div>

        <div
          className="badge-pill"
          style={{
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontSize: 12,
            padding: '4px 10px',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: dot,
              boxShadow: connected ? '0 0 8px #22c55e' : busy ? '0 0 8px var(--primary)' : 'none',
              animation: busy ? 'spin 1s linear infinite' : undefined,
            }}
          />
          <span>
            {connected
              ? 'Подключено'
              : busy
                ? 'Подключение…'
                : state === 'unavailable'
                  ? 'Только Desktop'
                  : state === 'error'
                    ? 'Ошибка'
                    : 'Ожидание Discord'}
          </span>
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {connected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)' }}>
            ✓ Активность в реальном времени отображается в вашем профиле Discord при просмотре аниме.
          </div>
        ) : (
          <div>
            <div>Чтобы активность появилась в профиле:</div>
            <ol style={{ margin: '8px 0 0', paddingLeft: 20, color: 'var(--text-muted)' }}>
              <li>Запустите приложение Discord и включите «Отображать текущую активность» в настройках.</li>
              <li>AniDa автоматически переподключается каждые 10 секунд.</li>
              <li>
                Application ID:{' '}
                <code
                  style={{
                    background: 'var(--surface-secondary)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    color: 'var(--primary)',
                  }}
                >
                  {status?.clientId || '1556678610407133264'}
                </code>
              </li>
            </ol>
            {status?.error && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                  marginTop: 10,
                  color: '#ef4444',
                  fontSize: 12,
                }}
              >
                <CircleAlert size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{status.error}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={refresh}
        className="btn-brutal"
        style={{
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--surface-secondary)',
          color: 'var(--text)',
          fontWeight: 800,
          fontSize: 12.5,
          padding: '9px 16px',
          borderRadius: 10,
        }}
      >
        {busy ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={14} />}
        Проверить подключение
      </button>
    </div>
  );
}
