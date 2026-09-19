import { asyncHandler } from '../utils/asyncHandler';
import { created } from '../utils/response';
import * as leads from '../services/lead.service';

export const postContact = asyncHandler(async (req, res) => {
  created(res, await leads.createContact(req.body), 'Thanks. We will get back to you within one business day.');
});

export const postConsultation = asyncHandler(async (req, res) => {
  created(res, await leads.createConsultation(req.body), 'Consultation request received. We will confirm your slot shortly.');
});

export const postHealthCheckup = asyncHandler(async (req, res) => {
  created(res, await leads.createHealthCheckup(req.body), 'Your Business Health Checkup has been submitted.');
});

export const postLeadMagnet = asyncHandler(async (req, res) => {
  created(res, await leads.createLeadMagnetLead(req.body), 'Your guide is ready to download.');
});

export const postApplication = asyncHandler(async (req, res) => {
  created(res, await leads.createApplication(req.body, req.file), 'Application received. Our team will review it shortly.');
});
