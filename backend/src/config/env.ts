import 'dotenv/config';
import { z } from 'zod';

const DEV_JWT = 'dev-only-secret-do-not-use-in-production-0000';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().optional(),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(32).default(DEV_JWT),
  ADMIN_EMAIL: z.string().email().default('admin@riyadvisoftwaretechnologies.com'),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default('Riyadvi Website <no-reply@riyadvisoftwaretechnologies.com>'),
  NOTIFY_EMAIL: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
const raw = parsed.data;

// Fail fast in production if anything sensitive is missing or left at its dev default.
if (raw.NODE_ENV === 'production') {
  const problems: string[] = [];
  if (!raw.MONGODB_URI) problems.push('MONGODB_URI is required');
  if (raw.JWT_SECRET === DEV_JWT) problems.push('JWT_SECRET must be set');
  if (!raw.ADMIN_PASSWORD_HASH) problems.push('ADMIN_PASSWORD_HASH is required (plain ADMIN_PASSWORD is dev-only)');
  if (problems.length) {
    console.error('Unsafe production configuration:\n - ' + problems.join('\n - '));
    process.exit(1);
  }
}

export const env = {
  ...raw,
  MONGODB_URI: raw.MONGODB_URI || 'mongodb://127.0.0.1:27017/riyadvi',
  corsOrigins: raw.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
  isProd: raw.NODE_ENV === 'production',
  smtpEnabled: Boolean(raw.SMTP_HOST),
};
