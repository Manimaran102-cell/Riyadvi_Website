import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../config/env';

let transporter: Transporter | null = null;
function getTransporter() {
  if (!env.smtpEnabled) return null;
  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  return transporter;
}

type Fields = Record<string, string | number | string[] | undefined>;

/**
 * Sends a plain-text notification to the Riyadvi team.
 * Never throws: a mail outage must not make a stored lead look like a failed request.
 */
export async function notifyTeam(subject: string, fields: Fields): Promise<void> {
  const t = getTransporter();
  if (!t || !env.NOTIFY_EMAIL) {
    if (!env.isProd) console.log(`[mail skipped] ${subject}`);
    return;
  }
  const body = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n');
  try {
    await t.sendMail({ from: env.MAIL_FROM, to: env.NOTIFY_EMAIL, subject: `[Riyadvi Website] ${subject}`, text: body });
  } catch (err) {
    console.error('Email notification failed:', (err as Error).message);
  }
}
