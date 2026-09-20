import type { Project } from '@/types';

/**
 * DRAFT case-study copy. Client names come from the assignment brief; challenge / solution / outcome text
 * is written from each client's industry and should be replaced with approved, verified details before launch.
 * Outcomes are deliberately qualitative: no invented metrics.
 */
export const projects: Project[] = [
  {
    slug: 'puratap', name: 'Puratap', client: 'Puratap', industry: 'Water purification', year: '2024', accent: '#4FB3E8', device: 'both', scene3d: false,
    summary: 'A product-led website that explains water purification clearly and turns interest into service enquiries.',
    challenge: 'Water-purifier buyers compare on technical specs they rarely understand, and the previous site did little to explain the difference or guide them to a service enquiry.',
    solution: 'We restructured the catalogue around buyer questions, added plain-language product explainers and built quote and service request flows that go straight to the sales team.',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    results: ['Product pages rebuilt around buyer questions', 'Service and quote requests captured in one place', 'Mobile-first layout for on-the-go research'],
    services: ['web-development', '3d-modeling'],
  },
  {
    slug: 'wanaromah', name: 'Wanaromah Perfumers', client: 'Wanaromah Perfumers', industry: 'Fragrance and retail', year: '2024', accent: '#C08CE0', device: 'laptop', scene3d: true,
    summary: 'A boutique e-commerce experience with an interactive 3D presentation of the fragrance collection.',
    challenge: 'Fragrance is sold on feeling, and a flat product grid could not convey the brand\u2019s craft or make the collection feel premium.',
    solution: 'We built a WooCommerce storefront with rich storytelling, a rotatable 3D product presentation and a checkout tuned for mobile shoppers.',
    technologies: ['WordPress', 'WooCommerce', 'Three.js', 'React Three Fiber'],
    results: ['Immersive 3D product presentation', 'Simplified mobile checkout', 'Editable catalogue managed by the client team'],
    services: ['web-development', '3d-modeling', 'digital-marketing'],
  },
  {
    slug: 'laxmi-astro-ai', name: 'Laxmi Astro AI', client: 'Laxmi Astro AI', industry: 'Consumer / AI', year: '2025', accent: '#F0A040', device: 'phone', scene3d: true,
    summary: 'A mobile app that pairs traditional astrology content with AI-assisted, personalised guidance.',
    challenge: 'Users wanted personalised readings on demand, but astrologer availability and long wait times limited how many people could be served.',
    solution: 'We designed a conversational app where birth details generate structured charts and AI-assisted guidance, with human expert escalation for deeper consultations.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'AI APIs'],
    results: ['Personalised guidance available on demand', 'Clear path from free insights to paid consultations', 'Admin tools to manage content and experts'],
    services: ['app-development', 'ui-ux-design'],
  },
  {
    slug: 'tony-and-guy', name: 'Tony & Guy', client: 'Tony & Guy', industry: 'Salon and beauty', year: '2023', accent: '#E86A92', device: 'both', scene3d: false,
    summary: 'A local-search and social growth programme with a booking-focused website for a salon brand.',
    challenge: 'Appointments were driven by walk-ins and word of mouth, with little visibility on Google or social platforms.',
    solution: 'We rebuilt the web presence around services and stylists, tightened local SEO and ran social campaigns that drive directly to online booking.',
    technologies: ['WordPress', 'Google Business Profile', 'Meta Ads', 'GA4'],
    results: ['Booking-first website structure', 'Local search profiles cleaned up and optimised', 'Monthly reporting on enquiries and bookings'],
    services: ['digital-marketing', 'web-development'],
  },
  {
    slug: 'studio11', name: 'Studio11', client: 'Studio11', industry: 'Creative studio', year: '2023', accent: '#7C8CFF', device: 'laptop', scene3d: false,
    summary: 'A portfolio site and identity refresh for a creative studio, designed to let the work lead.',
    challenge: 'The studio\u2019s output was stronger than its online presence, which looked generic and hid the most compelling work.',
    solution: 'We designed a focused visual system and a case-led portfolio with fast, image-rich pages and a simple project enquiry flow.',
    technologies: ['Next.js', 'Framer Motion', 'Figma'],
    results: ['Case-led portfolio structure', 'Consistent visual system across pages', 'Fast image-rich browsing'],
    services: ['ui-ux-design', 'web-development'],
  },
  {
    slug: 'sivam-physio-care', name: 'Sivam Physio Care', client: 'Sivam Physio Care', industry: 'Healthcare', year: '2024', accent: '#3EC7A0', device: 'phone', scene3d: false,
    summary: 'A patient-friendly website and booking flow for a physiotherapy clinic.',
    challenge: 'Patients phoned to book, which limited after-hours appointments and left the front desk overloaded.',
    solution: 'We created clear treatment pages, a simple online booking request and WhatsApp follow-up so patients can reach the clinic at any hour.',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'WhatsApp API'],
    results: ['Online appointment requests', 'Treatment pages that build trust', 'Reduced front-desk phone load'],
    services: ['web-development', 'app-development'],
  },
  {
    slug: 'pearl-housing', name: 'Pearl Housing', client: 'Pearl Housing', industry: 'Real estate', year: '2024', accent: '#E0C58A', device: 'both', scene3d: false,
    summary: 'A property showcase with plans, galleries and virtual walkthrough content for prospective buyers.',
    challenge: 'Buyers wanted to visualise homes before committing to site visits, and static brochures did not help.',
    solution: 'We built project pages with plans, amenities and a virtual walkthrough, plus lead capture tied to each development.',
    technologies: ['Next.js', 'Three.js', 'Blender', 'MongoDB'],
    results: ['Project pages with plans and walkthrough content', 'Lead capture per development', 'Sales team notified instantly of new enquiries'],
    services: ['web-development', 'ar-vr', '3d-modeling'],
  },
  {
    slug: 'nugenica-biotech-lab', name: 'Nugenica Biotech Lab', client: 'Nugenica Biotech Lab', industry: 'Biotechnology', year: '2025', accent: '#5AD1E6', device: 'laptop', scene3d: false,
    summary: 'A credibility-first website with 3D visuals that explain lab processes to non-specialists.',
    challenge: 'The science is complex, and investors and partners needed to grasp the capabilities quickly.',
    solution: 'We paired clear information architecture with 3D explainers of equipment and processes, plus a simple partner enquiry path.',
    technologies: ['Next.js', 'Three.js', 'Blender', 'Tailwind CSS'],
    results: ['3D explainers of lab processes', 'Clear structure for partners and investors', 'Content managed via a simple CMS'],
    services: ['web-development', '3d-modeling', 'ar-vr'],
  },
  {
    slug: 'visdoc', name: 'VisDoc', client: 'VisDoc', industry: 'Healthcare technology', year: '2025', accent: '#8DA2FF', device: 'phone', scene3d: false,
    summary: 'A product interface and design system for a document-centric healthcare application.',
    challenge: 'Clinical users work under time pressure, and the existing interface made simple tasks slow and error-prone.',
    solution: 'We researched real workflows, simplified the key journeys and delivered a component-based design system for consistent implementation.',
    technologies: ['Figma', 'React', 'Storybook', 'Node.js'],
    results: ['Streamlined core workflows', 'Reusable component library', 'Design and engineering aligned on one system'],
    services: ['ui-ux-design', 'app-development'],
  },
  {
    slug: 'cube-dental', name: 'Cube Dental', client: 'Cube Dental', industry: 'Dental care', year: '2023', accent: '#66D9C0', device: 'both', scene3d: false,
    summary: 'A modern clinic website and local marketing programme built around appointment requests.',
    challenge: 'New patients could not easily see treatments, pricing approach or how to book, and the clinic ranked poorly in local search.',
    solution: 'We rebuilt the site around treatments and patient questions, added instant appointment requests and optimised local search presence.',
    technologies: ['WordPress', 'Google Business Profile', 'GA4', 'Meta Ads'],
    results: ['Treatment-led site structure', 'Appointment requests with instant notifications', 'Improved local search foundations'],
    services: ['web-development', 'digital-marketing', 'ui-ux-design'],
  },
];
