import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';

/**
 * Frontend <-> backend contract test: runs the REAL frontend API client and the frontend's form option lists
 * against the real Express app (Mongo persistence stubbed). Catches drift between UI values and server enums.
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'x'.repeat(40);
process.env.CORS_ORIGINS = 'http://localhost:3000';

let server: Server;
let api: typeof import('../../frontend/lib/api').api;
let ApiError: typeof import('../../frontend/lib/api').ApiError;
let options: typeof import('../../frontend/lib/options');
let schemas: typeof import('../src/validators/schemas');
const stored: unknown[] = [];

before(async () => {
  const mongoose = (await import('mongoose')).default;
  const save = async function (this: any) { await this.validate(); stored.push(this.toObject()); return this; };
  (mongoose.Model.prototype as any).save = save;
  (mongoose.Model.prototype as any).$save = save;
  schemas = await import('../src/validators/schemas');
  server = (await import('../src/app')).createApp().listen(0);
  process.env.NEXT_PUBLIC_API_URL = `http://localhost:${(server.address() as { port: number }).port}`;
  ({ api, ApiError } = await import('../../frontend/lib/api'));
  options = await import('../../frontend/lib/options');
});
after(() => { server.close(); setTimeout(() => process.exit(0), 50); });

describe('frontend/backend contract', () => {
  test('UI option lists match server enums exactly', () => {
    const { HC, SERVICES } = schemas;
    const pairs: Record<string, readonly string[]> = { industry: HC.industry, size: HC.size, hasWebsite: HC.yesNoPlanned, mobile: HC.mobile, presence: HC.presence, channels: HC.marketingChannels, budget: HC.budget, tracks: HC.tracks, stack: HC.stack, needs: HC.needs, crm: HC.yesNo, challenge: HC.challenge, timeline: HC.timeline, projectBudget: HC.projectBudget };
    for (const [k, server] of Object.entries(pairs)) {
      assert.deepEqual((options.hc as any)[k].map((o: any) => o.value).sort(), [...server].sort(), `mismatch: ${k}`);
    }
    assert.deepEqual(options.requirementOptions.map((o) => o.value).sort(), [...SERVICES].sort());
  });

  test('every service slug is accepted as a contact requirement', async () => {
    const { services } = await import('../../frontend/data/services');
    for (const s of services) assert.ok((schemas.SERVICES as readonly string[]).includes(s.slug), s.slug);
  });

  test('client submits contact, consultation, lead magnet and health checkup', async () => {
    const first = (k: string) => (options.hc as any)[k][0].value;
    assert.ok((await api.contact({ name: 'Test User', email: 'a@b.co', phone: '+91 9080822034', company: '', requirement: options.requirementOptions[0].value, message: 'Hello there, need a site.' })).id);
    assert.ok((await api.consultation({ name: 'Test User', email: 'a@b.co', phone: '9080822034', topic: 'ar-vr', preferredDate: '2026-10-01', preferredTime: options.timeSlots[0].value })).id);
    assert.match((await api.leadMagnet({ name: 'Test', company: 'Acme', email: 'a@b.co', phone: '9080822034' })).downloadUrl, /planning-guide\.pdf$/);
    const r = await api.healthCheckup({
      business: { companyName: 'Acme', contactName: 'Test', email: 'a@b.co', phone: '9080822034', industry: first('industry'), companySize: first('size') },
      digital: { hasWebsite: first('hasWebsite'), websiteRating: 3, mobileFriendly: first('mobile'), presence: [] },
      marketing: { channels: [first('channels')], monthlyBudget: first('budget'), tracksLeads: first('tracks') },
      technology: { currentStack: first('stack'), needs: [first('needs')], usesCrm: first('crm') },
      challenges: { primary: [first('challenge')], timeline: first('timeline'), projectBudget: first('projectBudget') },
      consent: true, hp: '',
    });
    assert.ok(r.score >= 0 && r.score <= 100 && r.insights.length > 0);
  });

  test('client submits multipart job application', async () => {
    const { jobs } = await import('../../frontend/data/jobs');
    const fd = new FormData();
    Object.entries({ name: 'Test User', email: 'a@b.co', phone: '9080822034', position: jobs[0].title, jobSlug: jobs[0].slug, message: '', hp: '' }).forEach(([k, v]) => fd.append(k, v));
    fd.append('resume', new Blob(['%PDF-1.4 test'], { type: 'application/pdf' }), 'cv.pdf');
    assert.ok((await api.application(fd)).id);
  });

  test('server field errors surface as ApiError.fields', async () => {
    await assert.rejects(api.contact({ name: 'x', email: 'bad', phone: '1', requirement: 'nope', message: 'short' }), (e: any) => e instanceof ApiError && e.status === 422 && Boolean(e.fields.email && e.fields.requirement));
  });
});
