import { Schema, model } from 'mongoose';
import { baseOptions, statusField } from './common';

const schema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, maxlength: 160, index: true },
  phone: { type: String, required: true, maxlength: 20 },
  company: { type: String, maxlength: 120 },
  topic: { type: String, required: true },
  preferredDate: String,
  preferredTime: { type: String, enum: ['morning', 'afternoon', 'evening'] },
  message: { type: String, maxlength: 1000 },
  sourcePage: String,
  status: statusField,
}, baseOptions);
schema.index({ createdAt: -1 });

export const Consultation = model('Consultation', schema, 'consultation_requests');
