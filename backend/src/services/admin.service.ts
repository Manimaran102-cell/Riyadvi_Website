import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { Model } from 'mongoose';
import { env } from '../config/env';
import { Application, Consultation, Contact, HealthCheckup, LeadMagnet } from '../models';
import { AppError } from '../utils/AppError';

/* ---------- Auth ---------- */
const sha = (s: string) => crypto.createHash('sha256').update(s).digest();

export async function login(email: string, password: string): Promise<string> {
  const emailOk = crypto.timingSafeEqual(sha(email), sha(env.ADMIN_EMAIL.toLowerCase()));
  let passOk = false;
  if (env.ADMIN_PASSWORD_HASH) passOk = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
  else if (env.ADMIN_PASSWORD && !env.isProd) passOk = crypto.timingSafeEqual(sha(password), sha(env.ADMIN_PASSWORD));
  if (!emailOk || !passOk) throw new AppError(401, 'Incorrect email or password.', 'INVALID_CREDENTIALS');
  return jwt.sign({ role: 'admin', sub: env.ADMIN_EMAIL }, env.JWT_SECRET, { expiresIn: '8h' });
}

/* ---------- Collection registry: one uniform row shape for the dashboard tables ---------- */
type Row = { id: string; name: string; email: string; phone: string; company: string; requirement: string; status: string; createdAt: Date };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

interface Entry { model: Model<any>; label: string; toRow: (d: Doc) => Row }
const base = (d: Doc) => ({ id: String(d._id), name: d.name, email: d.email, phone: d.phone, status: d.status, createdAt: d.createdAt });

export const COLLECTIONS: Record<string, Entry> = {
  enquiries: { model: Contact, label: 'Enquiries', toRow: (d) => ({ ...base(d), company: d.company ?? '', requirement: d.requirement }) },
  consultations: { model: Consultation, label: 'Consultation requests', toRow: (d) => ({ ...base(d), company: d.company ?? '', requirement: d.topic }) },
  'health-checkups': { model: HealthCheckup, label: 'Health Checkup leads', toRow: (d) => ({ ...base(d), company: d.company, requirement: `Score ${d.score}/100 - ${(d.challenges?.primary ?? []).join(', ')}` }) },
  'lead-magnet': { model: LeadMagnet, label: 'Lead Magnet leads', toRow: (d) => ({ ...base(d), company: d.company, requirement: 'Software Project Planning Guide' }) },
  applications: { model: Application, label: 'Job applications', toRow: (d) => ({ ...base(d), company: '', requirement: d.position }) },
};

function entry(key: string): Entry {
  const e = COLLECTIONS[key];
  if (!e) throw new AppError(404, 'Unknown collection.', 'NOT_FOUND');
  return e;
}

export async function getStats() {
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const rows = await Promise.all(
    Object.entries(COLLECTIONS).map(async ([key, { model, label }]) => {
      const [total, fresh, last7] = await Promise.all([
        model.countDocuments({}),
        model.countDocuments({ status: 'new' }),
        model.countDocuments({ createdAt: { $gte: since } }),
      ]);
      return { key, label, total, new: fresh, last7Days: last7 };
    }),
  );
  return { collections: rows, grandTotal: rows.reduce((n, r) => n + r.total, 0) };
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function list(key: string, opts: { page: number; limit: number; status?: string; q?: string }) {
  const { model, toRow } = entry(key);
  const filter: Record<string, unknown> = {};
  if (opts.status) filter.status = opts.status;
  if (opts.q) {
    const rx = new RegExp(escapeRegex(opts.q.slice(0, 60)), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }];
  }
  const [items, total] = await Promise.all([
    model.find(filter).select('-resume.data').sort({ createdAt: -1 }).skip((opts.page - 1) * opts.limit).limit(opts.limit).lean(),
    model.countDocuments(filter),
  ]);
  return { items: items.map(toRow), total, page: opts.page, pages: Math.max(1, Math.ceil(total / opts.limit)) };
}

export async function detail(key: string, id: string) {
  const { model } = entry(key);
  const doc = await model.findById(id).select('-resume.data').lean();
  if (!doc) throw new AppError(404, 'Record not found.', 'NOT_FOUND');
  return doc;
}

export async function setStatus(key: string, id: string, status: string) {
  const { model, toRow } = entry(key);
  const doc = await model.findByIdAndUpdate(id, { status }, { new: true }).select('-resume.data').lean();
  if (!doc) throw new AppError(404, 'Record not found.', 'NOT_FOUND');
  return toRow(doc);
}

export async function getResume(id: string) {
  const doc = await Application.findById(id).select('+resume.data').lean();
  if (!doc?.resume?.data) throw new AppError(404, 'Resume not found.', 'NOT_FOUND');
  return doc.resume;
}
