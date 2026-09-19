import type { HealthCheckupInput } from '../validators/schemas';

export interface HealthResult {
  score: number;
  level: 'Foundation' | 'Growing' | 'Advancing' | 'Optimised';
  insights: string[];
}

/**
 * Transparent, rule-based readiness score (0-100). Weights:
 * website 25 · presence 10 · marketing 30 · technology 20 · focus 15
 */
export function scoreHealthCheckup(d: HealthCheckupInput): HealthResult {
  const insights: string[] = [];

  // Website (25)
  let website = { yes: 10, planned: 4, no: 0 }[d.digital.hasWebsite as 'yes' | 'planned' | 'no'];
  website += d.digital.websiteRating * 2;
  website += { yes: 5, unsure: 2, no: 0 }[d.digital.mobileFriendly as 'yes' | 'unsure' | 'no'];
  if (d.digital.hasWebsite !== 'yes') insights.push('A conversion-focused website is the fastest way to turn existing demand into enquiries.');
  else if (d.digital.websiteRating <= 3) insights.push('Your website is live but under-performing. A UX and performance refresh can lift enquiries without extra ad spend.');
  if (d.digital.mobileFriendly !== 'yes') insights.push('Most visitors arrive on mobile. Make mobile experience the first design target.');

  // Presence (10)
  const presence = Math.min(d.digital.presence.length, 5) * 2;

  // Marketing (30)
  const active = d.marketing.channels.filter((c) => c !== 'none').length;
  const budgetPts = { none: 0, 'under-25k': 3, '25k-100k': 6, '100k-500k': 8, '500k+': 10 }[d.marketing.monthlyBudget] ?? 0;
  const trackPts = { yes: 5, partially: 2, no: 0 }[d.marketing.tracksLeads as 'yes' | 'partially' | 'no'];
  const marketing = Math.min(active, 3) * 5 + budgetPts + trackPts;
  if (active === 0) insights.push('There is no active marketing channel yet. Start with search and one social channel, then measure.');
  if (d.marketing.tracksLeads !== 'yes') insights.push('Track every lead source. Without attribution you cannot tell which spend is working.');

  // Technology (20)
  const stackPts = { 'custom-code': 10, wordpress: 8, 'shopify-woocommerce': 8, 'no-code': 6, none: 0, 'not-sure': 2 }[d.technology.currentStack] ?? 0;
  const crmPts = d.technology.usesCrm === 'yes' ? 10 : 0;
  const technology = stackPts + crmPts;
  if (d.technology.usesCrm === 'no') insights.push('A lightweight CRM and lead workflow will stop enquiries from slipping through the cracks.');

  // Focus (15): fewer, clearer priorities score higher
  const focus = { 1: 15, 2: 10, 3: 5 }[Math.min(d.challenges.primary.length, 3) as 1 | 2 | 3] ?? 5;

  const score = Math.max(0, Math.min(100, Math.round(website + presence + marketing + technology + focus)));
  const level: HealthResult['level'] = score >= 85 ? 'Optimised' : score >= 65 ? 'Advancing' : score >= 40 ? 'Growing' : 'Foundation';
  if (insights.length === 0) insights.push('You have strong foundations. The next gains come from optimisation and automation.');
  return { score, level, insights: insights.slice(0, 4) };
}
