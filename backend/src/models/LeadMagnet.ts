import { Schema, model } from 'mongoose';
import { baseOptions, statusField } from './common';

const schema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  company: { type: String, required: true, maxlength: 120 },
  email: { type: String, required: true, lowercase: true, maxlength: 160, index: true },
  phone: { type: String, required: true, maxlength: 20 },
  asset: { type: String, default: 'software-project-planning-guide' },
  status: statusField,
}, baseOptions);
schema.index({ createdAt: -1 });

export const LeadMagnet = model('LeadMagnet', schema, 'lead_magnet_leads');
