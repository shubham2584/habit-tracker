import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';
import { redis } from './config/redis.js';

const app = express();

app.use(cors());
app.use(express.json());

// Simple hello
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend 👋' });
});

// Health check — verifies postgres and redis are reachable
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  try {
    const result = await pool.query('SELECT NOW() as now');
    health.postgres = { ok: true, now: result.rows[0].now };
  } catch (err) {
    health.postgres = { ok: false, error: err.message };
    health.status = 'degraded';
  }

  try {
    const pong = await redis.ping();
    health.redis = { ok: pong === 'PONG' };
  } catch (err) {
    health.redis = { ok: false, error: err.message };
    health.status = 'degraded';
  }

  // Tiny redis demo: increment a visit counter so you can see it actually works
  try {
    health.visits = await redis.incr('health:visits');
  } catch (err) {
    health.visits = null;
  }

  res.json(health);
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
