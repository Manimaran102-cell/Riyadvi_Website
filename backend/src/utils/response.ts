import type { Response } from 'express';

/** Every successful response has the same envelope: { success, message, data }. */
export function ok<T>(res: Response, data: T, message = 'OK', status = 200) {
  return res.status(status).json({ success: true, message, data });
}
export const created = <T>(res: Response, data: T, message = 'Created') => ok(res, data, message, 201);
