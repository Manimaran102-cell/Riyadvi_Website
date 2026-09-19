import { Router } from 'express';
import mongoose from 'mongoose';
import { requireDb } from '../middleware/requireDb';
import publicRoutes from './public.routes';
import adminRoutes from './admin.routes';

const r = Router();

r.get('/health', (_req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] ?? 'unknown';
  res.json({ success: true, data: { status: 'ok', db: dbState, uptime: Math.round(process.uptime()) } });
});

r.use(requireDb);
r.use('/admin', adminRoutes);
r.use('/', publicRoutes);

export default r;
