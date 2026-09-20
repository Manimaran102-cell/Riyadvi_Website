# Architecture plan

The eight planning artefacts the brief asks for (A to H). Kept in the repo so the design can be reviewed and extended.

## A. Folder structure
```
riyadvi-website/
├─ frontend/                    Next.js 14 (App Router) + TypeScript + Tailwind
│  ├─ app/                      routes (one folder per URL) + layout, template, sitemap, robots
│  ├─ components/
│  │  ├─ layout/                Header, Footer, Providers, WhatsAppButton
│  │  ├─ ui/                    Button, Container/Section, Breadcrumbs, Logo, ConsultButton
│  │  ├─ sections/              Hero, TransformationStory, ServicesShowcase, TechEcosystem, WhyRiyadvi,
│  │  │                         ServiceTemplate, ProjectCard, CaseStudyStage, AboutTimeline, PostCard ...
│  │  ├─ three/                 SceneCanvas (policy), CanvasHost, HeroScene, ServiceScene,
│  │  │                         TechConstellation, CaseStudyScene, Fallbacks, parts
│  │  ├─ forms/                 fields, useFormSubmit, Contact / Consultation / HealthCheckup / LeadMagnet / Application
│  │  └─ admin/                 AdminLogin, Dashboard, session
│  ├─ data/                     typed content: services, portfolio, blog, jobs, technologies, milestones
│  ├─ lib/                      content (data access layer), api client, validation (zod), options, site, utils
│  ├─ hooks/                    useQualityTier, useInView
│  └─ public/downloads/         Software Project Planning Guide (PDF)
├─ backend/                     Express + TypeScript + Mongoose
│  └─ src/  config · routes · controllers · services · models · validators · middleware · utils · seed · scripts
│     test/  API + frontend/backend contract tests
├─ docs/                        this file + WALKTHROUGH.md
├─ render.yaml                  API deployment blueprint
└─ README.md
```

## B. Route map
| URL | Source | Rendering |
|---|---|---|
| `/` | `app/page.tsx` | static |
| `/services` · `/services/[slug]` (6) | `ServiceTemplate` + `data/services.ts` | SSG |
| `/portfolio` · `/portfolio/[slug]` (10) | `data/portfolio.ts` | list dynamic (filter), pages SSG |
| `/about` | | static |
| `/blog` · `/blog/[slug]` (6) | `data/blog.ts` | list dynamic (search/filter), articles SSG |
| `/careers` · `/careers/[slug]` (6) | `data/jobs.ts` | list dynamic (filters), pages SSG |
| `/contact` · `/business-health-checkup` · `/software-project-planning-guide` | forms | static + client forms |
| `/admin/login` · `/admin` | protected, `noindex` | client |

## C. Component architecture
- **Data-driven templates.** `Service → ServiceTemplate`, `Project → case-study page`, `Job → job page`, `Post → article page`. Pages read content only through `lib/content.ts` (async functions), which is the single seam for a CMS/API swap.
- **One 3D entry point.** Every scene is wrapped by `SceneCanvas`, which owns tiering, pausing, fallbacks and lazy-loading (see G/H).
- **Forms.** `fields.tsx` primitives + `useFormSubmit` (loading / error / server-field-error / success) + per-form zod schema in `lib/validation.ts`.

## D. Database schema (MongoDB / Mongoose)
| Collection | Key fields |
|---|---|
| `contact_enquiries` | name, email, phone, company?, requirement, message, sourcePage, status |
| `consultation_requests` | name, email, phone, company?, topic, preferredDate?, preferredTime?, message?, status |
| `health_checkup_leads` | name, email, phone, company (denormalised) + business, digital, marketing, technology, challenges (sub-documents), score, level, status |
| `lead_magnet_leads` | name, company, email, phone, asset, status |
| `career_applications` | name, email, phone, position, jobSlug, message?, resume {filename, mimeType, size, data (select:false)}, status |

All: `createdAt/updatedAt`, `status ∈ new · contacted · qualified · closed`, index on `email`, `status`, `createdAt`.
Services / portfolio / blog / careers are API-ready typed records (see C) rather than collections in this iteration.

## E. API contract
Success: `{ "success": true, "message": string, "data": … }` · Error: `{ "success": false, "error": { "code", "message", "fields"? } }`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/health` | – | liveness + DB state |
| POST | `/api/contact` | – | JSON |
| POST | `/api/consultation` | – | JSON |
| POST | `/api/health-checkup` | – | nested JSON; returns `score`, `level`, `insights` |
| POST | `/api/lead-magnet` | – | returns `downloadUrl` |
| POST | `/api/applications` | – | `multipart/form-data`, field `resume` (PDF/DOC/DOCX ≤ 5 MB) |
| POST | `/api/admin/login` | – | returns JWT (8 h) |
| GET | `/api/admin/stats` | Bearer | totals, new, last 7 days per collection |
| GET | `/api/admin/:collection` | Bearer | `page, limit, status, q` · collections: enquiries, consultations, health-checkups, lead-magnet, applications |
| GET / PATCH | `/api/admin/:collection/:id` | Bearer | detail / `{status}` |
| GET | `/api/admin/applications/:id/resume` | Bearer | file download |

Status codes: 201 created · 400 bad JSON/id · 401 auth · 403 CORS · 404 · 413 too large · 422 validation · 429 rate limit · 503 DB down · 500.

## F. Design tokens
Gold `#D4AF37` (soft `#E6C862`, deep `#9C7E1E`) on true black `#000`; neutral elevation steps `#0f0f0f · #171717 · #2a2a2a`; text `#F3EFE4`, muted `#A8A8A8` (>8:1 on black). Type: Montserrat (display, tight tracking) + Inter (body), self-hosted via Fontsource. Signature device: blueprint **registration marks** (`.reg`) and gold hairlines; diamond bullets; no card-grid sameness (asymmetric 7/5 grids, ruled lists).

## G. 3D and animation plan
| Where | Technique |
|---|---|
| Home hero | R3F network: 96 instanced nodes on a Fibonacci sphere, nearest-neighbour edges, travelling data packets, metallic core; cursor tilt, hover scale, scroll push-back |
| Home services | one shared canvas, scene swaps per service (no six WebGL contexts) |
| Service pages | same `ServiceScene` per kind: browsers · phone · growth chart · AR tunnel · rotatable knot (click = wireframe) · floating UI |
| Technology | orbiting constellation; labels are real DOM buttons (keyboard accessible) |
| Case studies | 3D laptop + phone with a canvas-painted screen per project |
| Storytelling | GSAP + ScrollTrigger pinned timeline (home), horizontal pinned timeline (about) |
| Smooth scroll | Lenis driven by GSAP ticker |
| Micro-interactions | Motion: nav underline, tabs, modal, step transitions, score ring |

## H. Performance strategy
Tiering (`useQualityTier`): `static` (no WebGL / data-saver / ≤2 GB) → no canvas at all · `low` (phones, ≤4 cores, coarse pointer) → DPR ≤1.25, half the nodes, no antialias, no orbit controls (page scroll never blocked) · `high`. `frameloop` pauses off-screen / hidden tab; reduced-motion renders one frame. three.js is loaded on demand (`CanvasHost` via `next/dynamic`), keeping the home route at ~214 kB first-load JS. Procedural lighting (no HDR download), instancing, no textures except tiny canvas textures. Fonts self-hosted, subset via unicode-range. Hero headline animates in CSS so LCP never waits for JS.
