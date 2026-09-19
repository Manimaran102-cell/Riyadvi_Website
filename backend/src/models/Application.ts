import { Schema, model } from 'mongoose';
import { baseOptions, statusField } from './common';

const schema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, maxlength: 160, index: true },
  phone: { type: String, required: true, maxlength: 20 },
  position: { type: String, required: true, maxlength: 120 },
  jobSlug: String,
  message: { type: String, maxlength: 2000 },
  resume: {
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    // Stored in MongoDB so resumes survive ephemeral hosts (Render/Railway). 5 MB cap << 16 MB doc limit.
    data: { type: Buffer, required: true, select: false },
  },
  status: statusField,
}, baseOptions);
schema.index({ createdAt: -1 });

export const Application = model('Application', schema, 'career_applications');
