import type { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const requireDb: RequestHandler = (_req, _res, next) => {
  // Tests replace persistence with an in-memory stub, so the connection guard is skipped there.
  if (env.NODE_ENV !== 'test' && mongoose.connection.readyState !== 1) {
    return next(new AppError(503, 'The database is temporarily unavailable. Please try again shortly.', 'DB_UNAVAILABLE'));
  }
  next();
};
