import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` } });
};

const fail = (status: number, code: string, message: string, fields?: Record<string, string>) => ({
  status,
  body: { success: false, error: { code, message, ...(fields ? { fields } : {}) } } as { success: false; error: Record<string, unknown> },
});

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let out;

  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.') || 'body';
      if (!fields[key]) fields[key] = issue.message;
    }
    out = fail(422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', fields);
  } else if (err instanceof AppError) {
    out = fail(err.status, err.code, err.message, err.fields);
  } else if (err instanceof multer.MulterError) {
    out = err.code === 'LIMIT_FILE_SIZE'
      ? fail(413, 'FILE_TOO_LARGE', 'Resume must be 5 MB or smaller.', { resume: 'Resume must be 5 MB or smaller.' })
      : fail(400, 'UPLOAD_ERROR', 'The file upload could not be processed.');
  } else if (err instanceof mongoose.Error.ValidationError) {
    out = fail(422, 'VALIDATION_ERROR', 'Some values were rejected by the database schema.');
  } else if (err instanceof mongoose.Error.CastError) {
    out = fail(400, 'BAD_ID', 'Invalid identifier.');
  } else if (err?.type === 'entity.parse.failed') {
    out = fail(400, 'BAD_JSON', 'Request body is not valid JSON.');
  } else if (err?.type === 'entity.too.large') {
    out = fail(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');
  } else {
    console.error('Unhandled error:', err);
    out = fail(500, 'INTERNAL_ERROR', 'Something went wrong on our side. Please try again.');
    if (!env.isProd) out.body.error.debug = String(err?.message ?? err);
  }

  res.status(out.status).json(out.body);
};
