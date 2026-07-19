import express from 'express';
import cors from 'cors';
import client from 'prom-client';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// --- Prometheus metrics (Phase 18) ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestDuration);

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? true : allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get('/health/live', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/health/ready', (req, res) => {
  const mongoose = require('mongoose');
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not-ready' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
