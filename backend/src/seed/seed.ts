/**
 * Inserts realistic SAMPLE leads so the admin dashboard has something to show.
 *   npm run seed            -> add samples
 *   npm run seed -- --reset -> remove earlier samples first
 * Sample rows are tagged with the "@sample.riyadvi.dev" email domain so they are easy to identify and purge.
 */
import type { Model } from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import { Application, Consultation, Contact, HealthCheckup, LeadMagnet } from '../models';

const D = '@sample.riyadvi.dev';
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const pdf = Buffer.from('%PDF-1.4\n% sample resume\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF');

async function main() {
  await connectDB();
  const rx = new RegExp(D.replace('.', '\\.') + '$');
  if (process.argv.includes('--reset')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const m of [Contact, Consultation, HealthCheckup, LeadMagnet, Application] as Model<any>[]) await m.deleteMany({ email: rx });
    console.log('Removed previous sample data');
  }

  await Contact.insertMany([
    { name: 'Aarav Menon', email: `aarav${D}`, phone: '+91 98400 11122', company: 'Menon Textiles', requirement: 'web-development', message: 'We want a modern e-commerce site with WhatsApp ordering.', status: 'new', createdAt: daysAgo(0) },
    { name: 'Nisha Raman', email: `nisha${D}`, phone: '+91 98410 22233', company: 'Raman Clinics', requirement: 'ui-ux-design', message: 'Looking to redesign our patient booking app.', status: 'contacted', createdAt: daysAgo(2) },
    { name: 'Farhan Ali', email: `farhan${D}`, phone: '+971 50 123 4567', company: 'Gulf Interiors', requirement: 'ar-vr', message: 'Need an AR showroom for our furniture catalogue.', status: 'qualified', createdAt: daysAgo(5) },
    { name: 'Lakshmi Iyer', email: `lakshmi${D}`, phone: '+91 99400 33344', company: '', requirement: 'digital-marketing', message: 'SEO and social media for our boutique.', status: 'closed', createdAt: daysAgo(12) },
  ]);
  await Consultation.insertMany([
    { name: 'Sanjay Kumar', email: `sanjay${D}`, phone: '+91 98940 44455', company: 'Kumar Logistics', topic: 'app-development', preferredDate: '2026-10-05', preferredTime: 'afternoon', status: 'new', createdAt: daysAgo(1) },
    { name: 'Priya Natarajan', email: `priya${D}`, phone: '+91 97890 55566', topic: '3d-modeling', preferredTime: 'morning', status: 'contacted', createdAt: daysAgo(4) },
  ]);
  await HealthCheckup.insertMany([
    {
      name: 'Dr. Meera', email: `meera${D}`, phone: '+91 90000 66677', company: 'Cube Dental', score: 52, level: 'Growing', status: 'new', createdAt: daysAgo(1),
      business: { companyName: 'Cube Dental', contactName: 'Dr. Meera', industry: 'healthcare', companySize: '11-50' },
      digital: { hasWebsite: 'yes', websiteRating: 3, mobileFriendly: 'unsure', presence: ['website', 'instagram'] },
      marketing: { channels: ['social-media'], monthlyBudget: '25k-100k', tracksLeads: 'partially' },
      technology: { currentStack: 'wordpress', needs: ['redesign', 'automation'], usesCrm: 'no' },
      challenges: { primary: ['low-conversion', 'slow-performance'], timeline: '1-3-months', projectBudget: '1l-5l' },
    },
  ]);
  await LeadMagnet.insertMany([
    { name: 'Vikram Shah', company: 'Shah Realty', email: `vikram${D}`, phone: '+91 98111 77788', status: 'new', createdAt: daysAgo(0) },
    { name: 'Deepa Nair', company: 'Nair Studios', email: `deepa${D}`, phone: '+91 98222 88899', status: 'contacted', createdAt: daysAgo(3) },
  ]);
  await Application.insertMany([
    { name: 'Karthik S', email: `karthik${D}`, phone: '+91 90031 99900', position: 'Full Stack Developer', jobSlug: 'full-stack-developer', message: 'Three years with Next.js and Node.', status: 'new', resume: { filename: 'karthik-resume.pdf', mimeType: 'application/pdf', size: pdf.length, data: pdf }, createdAt: daysAgo(1) },
  ]);

  console.log('Sample data inserted');
  await disconnectDB();
}

main().catch((e) => { console.error(e); process.exit(1); });
