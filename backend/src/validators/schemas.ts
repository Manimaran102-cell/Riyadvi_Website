import { z } from 'zod';

/* ---------- Sanitising helpers ---------- */
// Strip HTML tags + control characters so stored values are safe to render anywhere.
const clean = (v: unknown) =>
  typeof v === 'string' ? v.replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim() : v;

const text = (min: number, max: number, label = 'This field') =>
  z.preprocess(clean, z.string({ required_error: `${label} is required` })
    .min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
    .max(max, `${label} must be ${max} characters or fewer`));

const optText = (max: number, label = 'This field') =>
  z.preprocess(clean, z.string().max(max, `${label} must be ${max} characters or fewer`).optional()).transform((v) => v || undefined);

const email = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v),
  z.string({ required_error: 'Email is required' }).email('Enter a valid email address').max(160),
);
const PHONE = /^\+?[0-9()\s-]{7,20}$/;
const phone = z.preprocess(clean, z.string({ required_error: 'Phone is required' }).regex(PHONE, 'Enter a valid phone number'));
const optPhone = z.preprocess(clean, z.string().regex(PHONE, 'Enter a valid phone number').optional().or(z.literal(''))).transform((v) => v || undefined);
const name = text(2, 100, 'Name');
type Vals = readonly [string, ...string[]];
const enumOf = (values: Vals, label = 'This field') =>
  z.enum(values as unknown as [string, ...string[]], { errorMap: () => ({ message: `Select a valid option for ${label.toLowerCase()}` }) });

/* ---------- Shared option lists (mirrored in frontend/lib/options.ts) ---------- */
export const SERVICES = ['web-development', 'app-development', 'digital-marketing', 'ar-vr', '3d-modeling', 'ui-ux-design', 'other'] as const;

/* ---------- Contact ---------- */
export const contactSchema = z.object({
  name,
  email,
  phone,
  company: optText(120, 'Company'),
  requirement: enumOf(SERVICES, 'requirement'),
  message: text(10, 2000, 'Message'),
  sourcePage: optText(200),
});
export type ContactInput = z.infer<typeof contactSchema>;

/* ---------- Consultation ---------- */
const TIME_SLOTS = ['morning', 'afternoon', 'evening'] as const;
export const consultationSchema = z.object({
  name,
  email,
  phone,
  company: optText(120, 'Company'),
  topic: enumOf(SERVICES, 'topic'),
  preferredDate: z.preprocess(clean, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date').optional().or(z.literal(''))).transform((v) => v || undefined),
  preferredTime: z.preprocess(clean, z.enum(TIME_SLOTS).optional().or(z.literal(''))).transform((v) => v || undefined),
  message: optText(1000, 'Message'),
  sourcePage: optText(200),
});
export type ConsultationInput = z.infer<typeof consultationSchema>;

/* ---------- Lead magnet ---------- */
export const leadMagnetSchema = z.object({
  name,
  company: text(2, 120, 'Company'),
  email,
  phone,
});
export type LeadMagnetInput = z.infer<typeof leadMagnetSchema>;

/* ---------- Business health checkup ---------- */
export const HC = {
  industry: ['retail-ecommerce', 'healthcare', 'education', 'real-estate', 'manufacturing', 'hospitality', 'professional-services', 'technology', 'other'],
  size: ['1-10', '11-50', '51-200', '200+'],
  yesNo: ['yes', 'no'],
  yesNoPlanned: ['yes', 'planned', 'no'],
  mobile: ['yes', 'no', 'unsure'],
  presence: ['website', 'google-business', 'facebook', 'instagram', 'linkedin', 'youtube', 'marketplaces'],
  marketingChannels: ['seo', 'social-media', 'paid-ads', 'email', 'content', 'none'],
  budget: ['none', 'under-25k', '25k-100k', '100k-500k', '500k+'],
  tracks: ['yes', 'partially', 'no'],
  stack: ['wordpress', 'shopify-woocommerce', 'custom-code', 'no-code', 'none', 'not-sure'],
  needs: ['new-website', 'redesign', 'mobile-app', 'ecommerce', 'automation', 'ar-vr', '3d-content', 'marketing'],
  challenge: ['low-traffic', 'low-conversion', 'outdated-design', 'slow-performance', 'manual-processes', 'no-digital-strategy', 'scaling', 'brand-visibility'],
  timeline: ['asap', '1-3-months', '3-6-months', 'exploring'],
  projectBudget: ['under-1l', '1l-5l', '5l-15l', '15l+', 'not-sure'],
} as const;

const list = (vals: Vals, min = 0, max = 10) =>
  z.array(z.enum(vals as unknown as [string, ...string[]]), { required_error: 'Select at least one option' })
    .min(min, 'Select at least one option').max(max).transform((a) => Array.from(new Set(a)));

export const healthCheckupSchema = z.object({
  business: z.object({
    companyName: text(2, 120, 'Company name'),
    contactName: name,
    email,
    phone,
    industry: enumOf(HC.industry , 'industry'),
    companySize: enumOf(HC.size , 'company size'),
    website: z.preprocess(clean, z.string().url('Enter a full URL, e.g. https://example.com').max(200).optional().or(z.literal(''))).transform((v) => v || undefined),
  }),
  digital: z.object({
    hasWebsite: enumOf(HC.yesNoPlanned , 'website'),
    websiteRating: z.coerce.number().int().min(1).max(5),
    mobileFriendly: enumOf(HC.mobile , 'mobile'),
    presence: list(HC.presence, 0),
  }),
  marketing: z.object({
    channels: list(HC.marketingChannels, 1),
    monthlyBudget: enumOf(HC.budget , 'budget'),
    tracksLeads: enumOf(HC.tracks , 'lead tracking'),
  }),
  technology: z.object({
    currentStack: enumOf(HC.stack , 'stack'),
    needs: list(HC.needs, 1),
    usesCrm: enumOf(HC.yesNo , 'CRM'),
  }),
  challenges: z.object({
    primary: list(HC.challenge, 1, 3),
    timeline: enumOf(HC.timeline , 'timeline'),
    projectBudget: enumOf(HC.projectBudget , 'budget'),
    notes: optText(1500, 'Notes'),
  }),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please agree so we can contact you' }) }),
  sourcePage: optText(200),
});
export type HealthCheckupInput = z.infer<typeof healthCheckupSchema>;

/* ---------- Career application (multipart text fields) ---------- */
export const applicationSchema = z.object({
  name,
  email,
  phone,
  position: text(2, 120, 'Position'),
  jobSlug: optText(120),
  message: optText(2000, 'Message'),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

/* ---------- Admin ---------- */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').max(200),
});
export const statusSchema = z.object({ status: z.enum(['new', 'contacted', 'qualified', 'closed']) });
