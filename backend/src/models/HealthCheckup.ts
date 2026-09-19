import { Schema, model } from 'mongoose';
import { baseOptions, statusField } from './common';

const schema = new Schema({
  // Denormalised top-level fields so the admin table can list every lead type uniformly
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, index: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  business: { type: Schema.Types.Mixed, required: true },
  digital: { type: Schema.Types.Mixed, required: true },
  marketing: { type: Schema.Types.Mixed, required: true },
  technology: { type: Schema.Types.Mixed, required: true },
  challenges: { type: Schema.Types.Mixed, required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  level: { type: String, required: true },
  sourcePage: String,
  status: statusField,
}, baseOptions);
schema.index({ createdAt: -1 });

export const HealthCheckup = model('HealthCheckup', schema, 'health_checkup_leads');
