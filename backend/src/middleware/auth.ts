import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const requireAdmin: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return next(new AppError(401, 'Authentication required.', 'UNAUTHORIZED'));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (payload.role !== 'admin') throw new Error('bad role');
    next();
  } catch {
    next(new AppError(401, 'Session expired. Please sign in again.', 'UNAUTHORIZED'));
  }
};
