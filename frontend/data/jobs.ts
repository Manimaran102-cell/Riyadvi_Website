import type { Job } from '@/types';

/** Sample openings. Replace or serve from an ATS/CMS: the Job shape drives the listing, filters and detail template. */
export const jobs: Job[] = [
  {
    slug: 'full-stack-developer', title: 'Full Stack Developer', department: 'Engineering', designation: 'Developer', experience: '1-3', experienceLabel: '1 to 3 years',
    location: 'Chennai (Mylapore)', type: 'Full-time', posted: '2026-09-01',
    summary: 'Build production web platforms and APIs for clients across India, Australia and the GCC.',
    responsibilities: ['Build and maintain React and Next.js front ends and Node.js APIs.', 'Design MongoDB and MySQL data models.', 'Review pull requests and improve code quality.', 'Work with designers to ship polished, accessible UI.'],
    requirements: ['Strong JavaScript and TypeScript fundamentals.', 'Experience with React and a Node.js framework.', 'Comfortable with Git and REST API design.', 'Clear written communication.'],
    niceToHave: ['Three.js or React Three Fiber', 'WordPress and WooCommerce experience'],
  },
  {
    slug: 'senior-frontend-engineer-3d', title: 'Senior Frontend Engineer (3D & Motion)', department: 'Engineering', designation: 'Senior Developer', experience: '3-5', experienceLabel: '3 to 5 years',
    location: 'Chennai (Mylapore)', type: 'Full-time', posted: '2026-08-24',
    summary: 'Lead interactive experiences built with React Three Fiber, GSAP and modern performance practices.',
    responsibilities: ['Own the architecture of 3D and animation-heavy front ends.', 'Optimise scenes for mobile GPUs and Core Web Vitals.', 'Mentor developers on animation and rendering techniques.', 'Prototype new interactive concepts with designers.'],
    requirements: ['Production experience with Three.js or React Three Fiber.', 'Deep knowledge of React and TypeScript.', 'Experience profiling and optimising runtime performance.'],
    niceToHave: ['Blender or Spline', 'Shader (GLSL) experience'],
  },
  {
    slug: 'ui-ux-designer', title: 'UI/UX Designer', department: 'Design', designation: 'Designer', experience: '1-3', experienceLabel: '1 to 3 years',
    location: 'Chennai (Mylapore) / Hybrid', type: 'Full-time', posted: '2026-08-30',
    summary: 'Design web and mobile products from research through to a documented design system.',
    responsibilities: ['Run user research and translate findings into flows.', 'Create wireframes, prototypes and polished UI in Figma.', 'Maintain and extend our design system.', 'Support developers through hand-off and QA.'],
    requirements: ['A portfolio demonstrating end-to-end product design.', 'Proficiency in Figma and prototyping.', 'Understanding of accessibility and responsive design.'],
    niceToHave: ['Motion design (Lottie / Rive)', '3D or spatial design experience'],
  },
  {
    slug: '3d-artist-unity-developer', title: '3D Artist / Unity Developer', department: 'Creative Technology', designation: 'Artist', experience: '3-5', experienceLabel: '3 to 5 years',
    location: 'Chennai (Mylapore)', type: 'Full-time', posted: '2026-08-15',
    summary: 'Create 3D assets and AR/VR experiences for real-estate, retail and training clients.',
    responsibilities: ['Model, texture and optimise 3D assets in Blender.', 'Build interactive AR/VR scenes in Unity.', 'Prepare web-ready glTF models with compressed textures.', 'Collaborate with developers to integrate assets.'],
    requirements: ['Strong Blender modelling and PBR texturing skills.', 'Experience shipping Unity projects.', 'Understanding of polygon and texture budgets.'],
  },
  {
    slug: 'digital-marketing-executive', title: 'Digital Marketing Executive', department: 'Marketing', designation: 'Executive', experience: 'fresher', experienceLabel: '0 to 1 year',
    location: 'Chennai (Mylapore)', type: 'Full-time', posted: '2026-09-05',
    summary: 'Run SEO, social and paid campaigns for a portfolio of clients and report on real outcomes.',
    responsibilities: ['Execute SEO, content and social calendars.', 'Set up and monitor Google and Meta ad campaigns.', 'Track performance in GA4 and prepare monthly reports.', 'Research keywords and competitor activity.'],
    requirements: ['Working knowledge of SEO and social platforms.', 'Good written English.', 'Analytical mindset and curiosity.'],
  },
  {
    slug: 'business-development-manager', title: 'Business Development Manager', department: 'Sales', designation: 'Manager', experience: '5+', experienceLabel: '5+ years',
    location: 'Chennai (Mylapore) / Remote', type: 'Full-time', posted: '2026-08-05',
    summary: 'Build relationships with growing businesses and guide them from first conversation to signed project.',
    responsibilities: ['Generate and qualify leads across India, Australia and the GCC.', 'Run discovery calls and prepare proposals.', 'Work with delivery teams on scope and pricing.', 'Maintain the pipeline in our CRM.'],
    requirements: ['5+ years in IT services or agency sales.', 'Proven record of closing project-based deals.', 'Ability to explain technical solutions in business terms.'],
  },
];
