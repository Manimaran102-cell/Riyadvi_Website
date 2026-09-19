import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

/** Parses + sanitises req.body with a zod schema; errors flow to errorHandler as 422. */
export const validate = (schema: ZodTypeAny): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) return next(result.error);
  req.body = result.data;
  next();
};

/** Bot trap: real users never fill the hidden `hp` field. Pretend success, store nothing. */
export const honeypot: RequestHandler = (req, res, next) => {
  if (req.body && typeof req.body.hp === 'string' && req.body.hp.length > 0) {
    return void res.status(201).json({ success: true, message: 'Received', data: { id: 'ignored' } });
  }
  next();
};
