import { z } from 'zod';

/** Client-side validation. Messages match the server so users see the same wording either way. */
const PHONE = /^\+?[0-9()\s-]{7,20}$/;
const email = z.string().trim().min(1, 'Email is required').email('Enter a valid email address');
const phone = z.string().trim().min(1, 'Phone is required').regex(PHONE, 'Enter a valid phone number');
const name = z.string().trim().min(2, 'Name must be at least 2 characters').max(100);
const select = (msg: string) => z.string().min(1, msg);

export const contactSchema = z.object({
  name, email, phone,
  company: z.string().trim().max(120).optional(),
  requirement: select('Choose a requirement'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

export const consultationSchema = z.object({
  name, email, phone,
  company: z.string().trim().max(120).optional(),
  topic: select('Choose a topic'),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().trim().max(1000).optional(),
});

export const leadMagnetSchema = z.object({
  name, email, phone,
  company: z.string().trim().min(2, 'Company is required').max(120),
});

export const applicationSchema = z.object({
  name, email, phone,
  position: z.string().trim().min(2, 'Position is required'),
  message: z.string().trim().max(2000).optional(),
});

/** Health checkup: one schema per step so each step validates on "Next". */
export const hcSteps = [
  z.object({
    companyName: z.string().trim().min(2, 'Company name is required'),
    contactName: name, email, phone,
    industry: select('Choose your industry'),
    companySize: select('Choose your company size'),
    website: z.string().trim().refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), 'Enter a full URL, e.g. https://example.com').optional(),
  }),
  z.object({ hasWebsite: select('Choose an option'), websiteRating: z.number().min(1, 'Rate your website').max(5), mobileFriendly: select('Choose an option') }),
  z.object({ channels: z.array(z.string()).min(1, 'Select at least one option'), monthlyBudget: select('Choose a budget'), tracksLeads: select('Choose an option') }),
  z.object({ currentStack: select('Choose an option'), needs: z.array(z.string()).min(1, 'Select at least one option'), usesCrm: select('Choose an option') }),
  z.object({ primary: z.array(z.string()).min(1, 'Select at least one challenge').max(3, 'Choose up to 3'), timeline: select('Choose a timeline'), projectBudget: select('Choose a budget range') }),
] as const;

export type FieldErrors = Record<string, string>;

export function check<S extends z.ZodTypeAny>(schema: S, data: unknown): { ok: true; data: z.infer<S> } | { ok: false; errors: FieldErrors } {
  const r = schema.safeParse(data);
  if (r.success) return { ok: true, data: r.data };
  const errors: FieldErrors = {};
  for (const i of r.error.issues) errors[i.path.join('.') || 'form'] ??= i.message;
  return { ok: false, errors };
}
