import multer from 'multer';
import type { RequestHandler } from 'express';
import { AppError } from '../utils/AppError';

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_BYTES, files: 1, fields: 20 },
  fileFilter(_req, file, cb) {
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXT.includes(ext) || !ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new AppError(422, 'Resume must be a PDF, DOC or DOCX file.', 'INVALID_FILE_TYPE', { resume: 'Upload a PDF, DOC or DOCX file.' }));
    }
    cb(null, true);
  },
});

export const resumeUpload: RequestHandler = upload.single('resume');

/** Extension/mime can be spoofed, so also check the file's magic bytes. */
export function hasValidSignature(buf: Buffer): boolean {
  const pdf = buf.subarray(0, 4).toString('latin1') === '%PDF';
  const zip = buf[0] === 0x50 && buf[1] === 0x4b; // .docx
  const ole = buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0; // .doc
  return pdf || zip || ole;
}
