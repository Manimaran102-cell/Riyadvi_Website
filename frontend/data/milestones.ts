import type { Milestone } from '@/types';

/**
 * Company journey. 2021 (foundation) and 2025 (TechBehemoths award) come from public listings.
 * The middle entries are illustrative and should be confirmed with Riyadvi before launch.
 */
export const milestones: Milestone[] = [
  { year: '2021', title: 'Company Founded', body: 'Launched with an innovative vision and technology solutions aimed at solving complex business challenges. We focused on building a strong foundation for digital transformation, offering bespoke services like website development and digital strategy consulting.' },
  { year: '2022', title: 'Market Expansion', body: 'Expanded our offerings to include additional services such as mobile app development and digital marketing. This was a key milestone in our mission to provide holistic digital solutions to clients across various industries. By collaborating with renowned brands.' },
  { year: '2023', title: 'Expansion to International Markets', body: 'Expanded our client base to include markets in Australia, successfully establishing our presence in the APAC region. This phase involved a thorough market analysis, localization of our services, and collaborations with international partners.' },
  { year: '2024', title: 'Global Recognition', body: 'Received the "Star of Excellence" Award from the National Integrity Cultural Academy, recognizing our contributions to advancing digital solutions and ethical business practices. This accolade highlights the success of our global expansion.'},
  { year: '2025', title: 'Recognised for delivery', body: 'Named a winner at the TechBehemoths 2025 Awards, and over 80 projects delivered to date.' },
];

export const journey = [
  { label: 'Strategy', body: 'Goals, audience and a measurable plan.' },
  { label: 'Design', body: 'Experiences shaped around real users.' },
  { label: 'Development', body: 'Clean, scalable engineering.' },
  { label: 'Marketing', body: 'Channels that bring the right audience.' },
  { label: 'Optimization', body: 'Data-led refinement after launch.' },
  { label: 'Growth', body: 'A roadmap that keeps compounding.' },
];

export const values = [
  { title: 'Customer satisfaction first', body: 'Every decision starts with what the client needs to achieve, then works backwards.' },
  { title: 'Clarity over jargon', body: 'Plain-language proposals, honest timelines and no surprises in the invoice.' },
  { title: 'Craft and performance', body: 'Beautiful is not enough. What we ship is fast, accessible and maintainable.' },
  { title: 'Long-term partnership', body: 'We stay after launch to measure, improve and grow what we built together.' },
];
