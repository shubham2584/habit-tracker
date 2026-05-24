import { useEffect, useState } from 'react';

const box = {
  background: '#0f172a',
  color: '#e2e8f0',
  padding: 16,
  borderRadius: 10,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  overflowX: 'auto',
};

function StatusDot({ ok }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: ok ? '#22c55e' : '#ef4444',
        marginRight: 8,
      }}
    />
  );
}

function App() {
  const [hello, setHello] = useState(null);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  const refresh = () => {
    setError(null);
    fetch('/api/hello')
      .then((r) => r.json())
      .then(setHello)
      .catch((e) => setError(e.message));

    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch((e) => setError(e.message));
  };

  useEffect(refresh, []);

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: 32,
        maxWidth: 720,
        margin: '0 auto',
        color: '#0f172a',
      }}
    >
      <h1 style={{ marginBottom: 4 }}>🌱 Habit Tracker</h1>
      <p style={{ color: '#64748b', marginTop: 0 }}>
        Stack health check — Nginx → React → Express → Postgres + Redis
      </p>

      <button
        onClick={refresh}
        style={{
          marginTop: 16,
          padding: '8px 16px',
          background: '#0f172a',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        Refresh
      </button>

      <section style={{ marginTop: 24 }}>
        <h2>Backend says</h2>
        <div style={box}>{hello ? JSON.stringify(hello, null, 2) : 'loading…'}</div>
        <div>
          <h2>Backend says:</h2>{hello?.message}</div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Health</h2>
        {health && (
          <div style={{ marginBottom: 12 }}>
            <div>
              <StatusDot ok={health.postgres?.ok} /> Postgres
            </div>
            <div>
              <StatusDot ok={health.redis?.ok} /> Redis
            </div>
            {health.visits != null && (
              <div style={{ color: '#64748b', marginTop: 4 }}>
                Redis visit counter: <strong>{health.visits}</strong>
              </div>
            )}
          </div>
        )}
        <div style={box}>{health ? JSON.stringify(health, null, 2) : 'loading…'}</div>
      </section>

      {error && (
        <p style={{ color: '#ef4444', marginTop: 16 }}>Error: {error}</p>
      )}
    </div>
  );
}

export default App;
