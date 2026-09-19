import { Router } from 'express';
import { loginLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { requireAdmin } from '../middleware/auth';
import * as c from '../controllers/admin.controller';
import { loginSchema, statusSchema } from '../validators/schemas';

const r = Router();
r.post('/login', loginLimiter, validate(loginSchema), c.login);

r.use(requireAdmin);
r.get('/stats', c.stats);
r.get('/applications/:id/resume', c.downloadResume);
r.get('/:collection', c.list);
r.get('/:collection/:id', c.detail);
r.patch('/:collection/:id', validate(statusSchema), c.updateStatus);

export default r;
