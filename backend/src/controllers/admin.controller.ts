import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/response';
import * as admin from '../services/admin.service';

export const login = asyncHandler(async (req, res) => {
  const token = await admin.login(req.body.email, req.body.password);
  ok(res, { token, expiresIn: '8h' }, 'Signed in');
});

export const stats = asyncHandler(async (_req, res) => ok(res, await admin.getStats()));

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['new', 'contacted', 'qualified', 'closed']).optional(),
  q: z.string().trim().max(60).optional(),
});

export const list = asyncHandler(async (req, res) => {
  const query = listQuery.parse(req.query);
  ok(res, await admin.list(req.params.collection, query));
});

export const detail = asyncHandler(async (req, res) => ok(res, await admin.detail(req.params.collection, req.params.id)));

export const updateStatus = asyncHandler(async (req, res) => {
  ok(res, await admin.setStatus(req.params.collection, req.params.id, req.body.status), 'Status updated');
});

export const downloadResume = asyncHandler(async (req, res) => {
  const resume = await admin.getResume(req.params.id);
  res.setHeader('Content-Type', resume.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${resume.filename.replace(/"/g, '')}"`);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(Buffer.from(resume.data as unknown as Buffer));
});
