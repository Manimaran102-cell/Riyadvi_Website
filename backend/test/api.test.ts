import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type { Express } from 'express';
import type supertestType from 'supertest';

/**
 * API contract tests. MongoDB is replaced by an in-memory stub of Model#save so the suite runs anywhere
 * (validation, sanitising, auth, error shapes and the real Mongoose schemas are still exercised).
 */
process.env.NODE_ENV = 'test';
process.env.ADMIN_EMAIL = 'admin@test.dev';
process.env.ADMIN_PASSWORD = 'test-password-123';
process.env.JWT_SECRET = 'x'.repeat(40);
process.env.CORS_ORIGINS = 'http://localhost:3000,https://*.vercel.app';

let app: Express;
let request: typeof supertestType;
const saved: Record<string, any>[] = [];

before(async () => {
  const mongoose = (await import('mongoose')).default;
  const save = async function (this: any) {
    await this.validate();
    saved.push(this.toObject());
    return this;
  };
  (mongoose.Model.prototype as any).save = save;
  (mongoose.Model.prototype as any).$save = save;
  (mongoose.Model as any).countDocuments = async () => 2;
  request = (await import('supertest')).default;
  app = (await import('../src/app')).createApp();
});
after(() => setTimeout(() => process.exit(0), 50));

const contact = { name: 'Asha Rao', email: 'ASHA@Example.com', phone: '+91 90808 22034', company: 'Acme', requirement: 'web-development', message: 'We need a new website for our clinic.' };
const pdf = Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF');
const cfg = { email: 'admin@test.dev', password: 'test-password-123' };

describe('platform', () => {
  test('health endpoint', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.status, 'ok');
  });
  test('unknown route returns JSON 404', async () => {
    const res = await request(app).get('/api/nope');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });
  test('malformed JSON returns 400', async () => {
    const res = await request(app).post('/api/contact').set('Content-Type', 'application/json').send('{bad');
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, 'BAD_JSON');
  });
  test('CORS: allows listed + wildcard origins, blocks others', async () => {
    assert.equal((await request(app).get('/api/health').set('Origin', 'http://localhost:3000')).status, 200);
    assert.equal((await request(app).get('/api/health').set('Origin', 'https://riyadvi-git-main.vercel.app')).status, 200);
    assert.equal((await request(app).get('/api/health').set('Origin', 'https://evil.example')).status, 403);
  });
});

describe('POST /api/contact', () => {
  test('stores a valid enquiry and normalises email', async () => {
    const res = await request(app).post('/api/contact').send(contact);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.equal(saved.at(-1)!.email, 'asha@example.com');
    assert.equal(saved.at(-1)!.status, 'new');
  });
  test('rejects invalid input with per-field errors', async () => {
    const res = await request(app).post('/api/contact').send({ ...contact, email: 'nope', phone: 'abc', message: 'short' });
    assert.equal(res.status, 422);
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
    assert.ok(res.body.error.fields.email && res.body.error.fields.phone && res.body.error.fields.message);
  });
  test('strips HTML from text fields', async () => {
    await request(app).post('/api/contact').send({ ...contact, message: 'Hello <script>alert(1)</script> there, please call me.' });
    assert.ok(!saved.at(-1)!.message.includes('<'));
  });
  test('honeypot silently ignores bots', async () => {
    const before = saved.length;
    const res = await request(app).post('/api/contact').send({ ...contact, hp: 'gotcha' });
    assert.equal(res.status, 201);
    assert.equal(saved.length, before);
  });
});

describe('POST /api/consultation, /lead-magnet', () => {
  test('consultation request is stored', async () => {
    const res = await request(app).post('/api/consultation').send({ name: 'Ravi K', email: 'ravi@x.com', phone: '9080822034', topic: 'app-development', preferredDate: '2026-10-01', preferredTime: 'morning' });
    assert.equal(res.status, 201);
  });
  test('consultation rejects bad date', async () => {
    const res = await request(app).post('/api/consultation').send({ name: 'Ravi K', email: 'ravi@x.com', phone: '9080822034', topic: 'app-development', preferredDate: '01/10/2026' });
    assert.equal(res.status, 422);
  });
  test('lead magnet returns download URL', async () => {
    const res = await request(app).post('/api/lead-magnet').send({ name: 'Meena', company: 'Pearl', email: 'm@pearl.in', phone: '+91 9876543210' });
    assert.equal(res.status, 201);
    assert.match(res.body.data.downloadUrl, /planning-guide\.pdf$/);
  });
  test('lead magnet requires company', async () => {
    const res = await request(app).post('/api/lead-magnet').send({ name: 'Meena', email: 'm@pearl.in', phone: '+91 9876543210' });
    assert.equal(res.status, 422);
    assert.ok(res.body.error.fields.company);
  });
});

describe('POST /api/health-checkup', () => {
  const payload = {
    business: { companyName: 'Cube Dental', contactName: 'Dr. Priya', email: 'priya@cube.in', phone: '9000000000', industry: 'healthcare', companySize: '11-50', website: 'https://cube.example' },
    digital: { hasWebsite: 'yes', websiteRating: 3, mobileFriendly: 'unsure', presence: ['website', 'instagram'] },
    marketing: { channels: ['social-media'], monthlyBudget: '25k-100k', tracksLeads: 'partially' },
    technology: { currentStack: 'wordpress', needs: ['redesign', 'automation'], usesCrm: 'no' },
    challenges: { primary: ['low-conversion', 'slow-performance'], timeline: '1-3-months', projectBudget: '1l-5l', notes: 'Need more bookings' },
    consent: true,
  };
  test('scores and stores a checkup', async () => {
    const res = await request(app).post('/api/health-checkup').send(payload);
    assert.equal(res.status, 201);
    assert.ok(res.body.data.score >= 0 && res.body.data.score <= 100);
    assert.ok(res.body.data.insights.length > 0);
    assert.equal(saved.at(-1)!.company, 'Cube Dental');
  });
  test('rejects missing consent and empty selections', async () => {
    const res = await request(app).post('/api/health-checkup').send({ ...payload, consent: false, marketing: { ...payload.marketing, channels: [] } });
    assert.equal(res.status, 422);
    assert.ok(res.body.error.fields.consent);
    assert.ok(res.body.error.fields['marketing.channels']);
  });
});

describe('POST /api/applications', () => {
  const fields = (r: any) => r.field('name', 'Karthik S').field('email', 'k@dev.io').field('phone', '9123456780').field('position', 'Full Stack Developer').field('jobSlug', 'full-stack-developer');
  test('accepts a PDF resume', async () => {
    const res = await fields(request(app).post('/api/applications')).attach('resume', pdf, { filename: 'cv.pdf', contentType: 'application/pdf' });
    assert.equal(res.status, 201);
    assert.equal(saved.at(-1)!.resume.filename, 'cv.pdf');
  });
  test('rejects missing resume', async () => {
    const res = await fields(request(app).post('/api/applications'));
    assert.equal(res.status, 422);
    assert.equal(res.body.error.code, 'RESUME_REQUIRED');
  });
  test('rejects disallowed extension', async () => {
    const res = await fields(request(app).post('/api/applications')).attach('resume', Buffer.from('MZ'), { filename: 'evil.exe', contentType: 'application/octet-stream' });
    assert.equal(res.status, 422);
    assert.equal(res.body.error.code, 'INVALID_FILE_TYPE');
  });
  test('rejects spoofed PDF (bad magic bytes)', async () => {
    const res = await fields(request(app).post('/api/applications')).attach('resume', Buffer.from('just text'), { filename: 'cv.pdf', contentType: 'application/pdf' });
    assert.equal(res.status, 422);
  });
  test('rejects files over 5 MB', async () => {
    const big = Buffer.concat([pdf, Buffer.alloc(5 * 1024 * 1024 + 10)]);
    const res = await fields(request(app).post('/api/applications')).attach('resume', big, { filename: 'cv.pdf', contentType: 'application/pdf' });
    assert.equal(res.status, 413);
  });
});

describe('admin API', () => {
  test('requires auth', async () => {
    assert.equal((await request(app).get('/api/admin/stats')).status, 401);
    assert.equal((await request(app).get('/api/admin/stats').set('Authorization', 'Bearer garbage')).status, 401);
  });
  test('rejects wrong password', async () => {
    const res = await request(app).post('/api/admin/login').send({ ...cfg, password: 'wrong' });
    assert.equal(res.status, 401);
  });
  test('login then stats', async () => {
    const login = await request(app).post('/api/admin/login').send(cfg);
    assert.equal(login.status, 200);
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${login.body.data.token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.data.collections.length, 5);
    assert.equal(res.body.data.grandTotal, 10);
  });
  test('unknown collection is 404', async () => {
    const login = await request(app).post('/api/admin/login').send(cfg);
    const res = await request(app).get('/api/admin/secrets').set('Authorization', `Bearer ${login.body.data.token}`);
    assert.equal(res.status, 404);
  });
});
