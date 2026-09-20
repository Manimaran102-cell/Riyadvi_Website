export type SceneKind = 'web' | 'app' | 'marketing' | 'arvr' | 'model' | 'uiux';

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  scene: SceneKind;
  hero: { headline: string; sub: string };
  problem: { title: string; body: string; points: string[] };
  solution: { title: string; body: string };
  features: { title: string; body: string }[];
  useCases: { industry: string; body: string }[];
  stack: string[];
  process: { title: string; body: string }[];
  relatedProjects: string[];
}

export interface Project {
  slug: string;
  name: string;
  client: string;
  industry: string;
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  technologies: string[];
  results: string[];
  services: string[];
  accent: string;
  device: 'phone' | 'laptop' | 'both';
  /** When true, the case study renders the interactive 3D presentation. */
  scene3d: boolean;
  liveUrl?: string;
  images?: string[];
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readMinutes: number;
  featured?: boolean;
  body: Block[];
}

export type ExperienceBand = 'fresher' | '1-3' | '3-5' | '5+';

export interface Job {
  slug: string;
  title: string;
  department: string;
  designation: string;
  experience: ExperienceBand;
  experienceLabel: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  posted: string;
}

export interface Milestone { year: string; title: string; body: string }
export interface Tech { name: string; category: string; blurb: string }
