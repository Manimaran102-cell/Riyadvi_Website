import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimit';
import routes from './routes';
import { AppError } from './utils/AppError';

/** Supports exact origins and simple wildcards such as https://*.vercel.app */
const originMatchers = env.corsOrigins.map((o) =>
  o.includes('*') ? new RegExp('^' + o.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[a-z0-9-]+') + '$') : o,
);
const isAllowed = (origin: string) => originMatchers.some((m) => (typeof m === 'string' ? m === origin : m.test(origin)));

export function createApp() {
  const app = express();
  if (env.isProd) app.set('trust proxy', 1); // Render/Railway sit behind a proxy
  app.disable('x-powered-by');

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || isAllowed(origin)) return cb(null, true);
        cb(new AppError(403, 'This origin is not allowed.', 'CORS_FORBIDDEN'));
      },
      methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86_400,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  app.get('/', (_req, res) => res.json({ success: true, data: { name: 'Riyadvi API', docs: '/api/health' } }));
  app.use('/api', generalLimiter, routes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
