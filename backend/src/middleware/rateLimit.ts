import rateLimit from 'express-rate-limit';

const base = { standardHeaders: true, legacyHeaders: false, skip: () => process.env.NODE_ENV === 'test' } as const;
const message = (text: string) => ({ success: false, error: { code: 'RATE_LIMITED', message: text } });

export const generalLimiter = rateLimit({ ...base, windowMs: 15 * 60_000, limit: 300, message: message('Too many requests. Please slow down.') });
export const formLimiter = rateLimit({ ...base, windowMs: 15 * 60_000, limit: 20, message: message('Too many submissions. Please try again in a few minutes.') });
export const loginLimiter = rateLimit({ ...base, windowMs: 15 * 60_000, limit: 10, message: message('Too many login attempts. Try again later.') });
