import type { Post } from '@/types';

/** Sample articles in a CMS-shaped structure (slug, category, tags, block body). */
export const posts: Post[] = [
  {
    slug: 'is-your-website-ready-for-growth', featured: true,
    title: 'Is your website ready for your next stage of growth?',
    excerpt: 'Five signals that your website has become the bottleneck, and what to fix first.',
    category: 'Digital Strategy', tags: ['website', 'growth', 'conversion'], author: 'Riyadvi Team', date: '2026-08-12', readMinutes: 6,
    body: [
      { type: 'p', text: 'Most websites are built for launch day, not for the business you will be in two years from now. Growth exposes the gaps: slow pages, unclear offers and forms that quietly lose leads.' },
      { type: 'h2', text: 'Five signals to watch' },
      { type: 'ul', items: ['Traffic is rising but enquiries are flat.', 'Your team avoids updating the site because it is slow or risky.', 'Mobile visitors leave faster than desktop visitors.', 'You cannot tell which channel produces customers.', 'Competitors look more established online, even though you are better.'] },
      { type: 'h2', text: 'Fix the funnel before the design' },
      { type: 'p', text: 'A redesign feels productive, but the biggest gains usually come from clarity: a sharper headline, one primary action per page and a shorter path to contact. Measure that before you touch the visuals.' },
      { type: 'quote', text: 'A website is not a brochure. It is your most scalable salesperson, and it needs the same coaching.' },
      { type: 'h2', text: 'Where to start' },
      { type: 'p', text: 'Run a quick health check across performance, mobile experience, tracking and conversion paths. It takes an afternoon and tells you what to fix in the next 30 days.' },
    ],
  },
  {
    slug: 'nextjs-vs-wordpress-for-business-sites',
    title: 'Next.js or WordPress? How to choose for a business website',
    excerpt: 'Both are excellent. The right choice depends on your team, your content and your ambitions.',
    category: 'Web Development', tags: ['nextjs', 'wordpress', 'cms'], author: 'Riyadvi Team', date: '2026-07-28', readMinutes: 5,
    body: [
      { type: 'p', text: 'This is the most common question we hear from new clients, and the honest answer is that neither is universally better.' },
      { type: 'h2', text: 'Choose WordPress when' },
      { type: 'ul', items: ['Marketing needs to publish daily without developer help.', 'You need a store quickly with WooCommerce.', 'Budget and time to launch are the main constraints.'] },
      { type: 'h2', text: 'Choose Next.js when' },
      { type: 'ul', items: ['Performance and custom interactions are a differentiator.', 'The site is part of a larger product or platform.', 'You want full control of the design system and integrations.'] },
      { type: 'p', text: 'You can also combine them: WordPress or another CMS as the editing back end, with Next.js delivering a fast, custom front end.' },
    ],
  },
  {
    slug: 'why-3d-on-the-web-needs-a-mobile-plan',
    title: 'Why 3D on the web needs a mobile plan',
    excerpt: 'Interactive 3D can lift engagement, but only if it respects the phone in your visitor\u2019s pocket.',
    category: '3D & Immersive', tags: ['3d', 'performance', 'threejs'], author: 'Riyadvi Team', date: '2026-07-10', readMinutes: 5,
    body: [
      { type: 'p', text: 'A stunning 3D hero that stutters on a mid-range phone is worse than no 3D at all. The fix is not to avoid 3D; it is to design tiers.' },
      { type: 'h2', text: 'Three tiers that work' },
      { type: 'ul', items: ['Full quality on capable desktops with higher pixel ratio and richer geometry.', 'A reduced scene on phones: fewer objects, capped pixel ratio, simpler materials.', 'A static, well-designed fallback when WebGL is unavailable, data-saver is on or motion is reduced.'] },
      { type: 'h2', text: 'Habits that keep 3D fast' },
      { type: 'ul', items: ['Load the scene after the text, so it never blocks first paint.', 'Pause rendering when the canvas is off-screen.', 'Compress models and textures before they reach the browser.'] },
      { type: 'p', text: 'Treat performance as part of the creative brief. Constraints tend to produce cleaner, more intentional visuals.' },
    ],
  },
  {
    slug: 'what-a-good-software-project-brief-includes',
    title: 'What a good software project brief includes',
    excerpt: 'A one-page brief saves weeks of rework. Here is what to put in it.',
    category: 'Project Planning', tags: ['planning', 'software', 'brief'], author: 'Riyadvi Team', date: '2026-06-22', readMinutes: 4,
    body: [
      { type: 'p', text: 'Projects go over budget most often because the goal was never written down. A short, honest brief fixes most of it.' },
      { type: 'h2', text: 'Include these seven things' },
      { type: 'ul', items: ['The business goal and how success will be measured.', 'Who the users are and what they need to do.', 'Must-have features versus nice-to-have.', 'Integrations and existing systems.', 'Timeline and any fixed deadlines.', 'Budget range.', 'Who makes decisions on your side.'] },
      { type: 'p', text: 'Our Software Project Planning Guide expands each of these with worked examples and a checklist you can reuse.' },
    ],
  },
  {
    slug: 'seo-basics-for-local-businesses',
    title: 'SEO basics for local businesses in 2026',
    excerpt: 'Clinics, salons and shops win on local search with a handful of consistent habits.',
    category: 'Digital Marketing', tags: ['seo', 'local', 'marketing'], author: 'Riyadvi Team', date: '2026-06-05', readMinutes: 5,
    body: [
      { type: 'p', text: 'Local search rewards businesses that are accurate, active and well reviewed. None of that requires a large budget.' },
      { type: 'h2', text: 'The essentials' },
      { type: 'ul', items: ['Claim and complete your Google Business Profile, then keep hours and photos current.', 'Use the same name, address and phone number everywhere.', 'Create one page per service and per location you serve.', 'Ask happy customers for reviews and reply to every one.'] },
      { type: 'h2', text: 'Measure what matters' },
      { type: 'p', text: 'Track calls, direction requests and form fills, not just rankings. Rankings are a means; enquiries are the goal.' },
    ],
  },
  {
    slug: 'designing-a-design-system-that-developers-use',
    title: 'Designing a design system that developers actually use',
    excerpt: 'A design system succeeds when it is easier than starting from scratch.',
    category: 'UI/UX Design', tags: ['design-system', 'ux', 'figma'], author: 'Riyadvi Team', date: '2026-05-18', readMinutes: 4,
    body: [
      { type: 'p', text: 'Design systems fail when they are treated as a poster instead of a product. Developers adopt what saves them time.' },
      { type: 'h2', text: 'Principles we follow' },
      { type: 'ul', items: ['Start with tokens: colour, type, spacing, radius, motion.', 'Build the ten components used on every screen first.', 'Document states, not just the happy path: loading, empty, error.', 'Keep design and code in sync with a single source of truth.'] },
      { type: 'p', text: 'Small, well-maintained systems beat large, abandoned ones every time.' },
    ],
  },
];
