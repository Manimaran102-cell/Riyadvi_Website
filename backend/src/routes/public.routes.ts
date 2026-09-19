import { Router } from 'express';
import { formLimiter } from '../middleware/rateLimit';
import { honeypot, validate } from '../middleware/validate';
import { resumeUpload } from '../middleware/upload';
import * as c from '../controllers/public.controller';
import { applicationSchema, consultationSchema, contactSchema, healthCheckupSchema, leadMagnetSchema } from '../validators/schemas';

const r = Router();
r.use(formLimiter);

r.post('/contact', honeypot, validate(contactSchema), c.postContact);
r.post('/consultation', honeypot, validate(consultationSchema), c.postConsultation);
r.post('/health-checkup', honeypot, validate(healthCheckupSchema), c.postHealthCheckup);
r.post('/lead-magnet', honeypot, validate(leadMagnetSchema), c.postLeadMagnet);
r.post('/applications', resumeUpload, honeypot, validate(applicationSchema), c.postApplication);

export default r;
