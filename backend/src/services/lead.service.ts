import { Application, Consultation, Contact, HealthCheckup, LeadMagnet } from '../models';
import type { ApplicationInput, ConsultationInput, ContactInput, HealthCheckupInput, LeadMagnetInput } from '../validators/schemas';
import { AppError } from '../utils/AppError';
import { hasValidSignature } from '../middleware/upload';
import { notifyTeam } from './mail.service';
import { scoreHealthCheckup } from './healthScore.service';

export const GUIDE_PATH = '/downloads/software-project-planning-guide.pdf';

export async function createContact(input: ContactInput) {
  const doc = await Contact.create(input);
  void notifyTeam(`New contact enquiry from ${input.name}`, { ...input });
  return { id: doc.id as string };
}

export async function createConsultation(input: ConsultationInput) {
  const doc = await Consultation.create(input);
  void notifyTeam(`Consultation request from ${input.name}`, { ...input });
  return { id: doc.id as string };
}

export async function createHealthCheckup(input: HealthCheckupInput) {
  const result = scoreHealthCheckup(input);
  const { business, digital, marketing, technology, challenges, sourcePage } = input;
  const doc = await HealthCheckup.create({
    name: business.contactName,
    email: business.email,
    phone: business.phone,
    company: business.companyName,
    business, digital, marketing, technology, challenges,
    score: result.score,
    level: result.level,
    sourcePage,
  });
  void notifyTeam(`Business Health Checkup: ${business.companyName} (${result.score}/100)`, {
    Company: business.companyName, Contact: business.contactName, Email: business.email, Phone: business.phone,
    Score: `${result.score}/100 (${result.level})`, Priorities: challenges.primary, Needs: technology.needs, Timeline: challenges.timeline,
  });
  return { id: doc.id as string, ...result };
}

export async function createLeadMagnetLead(input: LeadMagnetInput) {
  const doc = await LeadMagnet.create(input);
  void notifyTeam(`Planning Guide download: ${input.name} (${input.company})`, { ...input });
  return { id: doc.id as string, downloadUrl: GUIDE_PATH };
}

export async function createApplication(input: ApplicationInput, file?: Express.Multer.File) {
  if (!file) throw new AppError(422, 'Please attach your resume.', 'RESUME_REQUIRED', { resume: 'Please attach your resume.' });
  if (!hasValidSignature(file.buffer)) {
    throw new AppError(422, 'That file does not look like a valid PDF or Word document.', 'INVALID_FILE_TYPE', { resume: 'That file does not look like a valid PDF or Word document.' });
  }
  const safeName = file.originalname.replace(/[^\w.\- ]+/g, '_').slice(0, 120);
  const doc = await Application.create({
    ...input,
    resume: { filename: safeName, mimeType: file.mimetype, size: file.size, data: file.buffer },
  });
  void notifyTeam(`Job application: ${input.position} - ${input.name}`, { ...input, Resume: `${safeName} (${Math.round(file.size / 1024)} KB)` });
  return { id: doc.id as string };
}
