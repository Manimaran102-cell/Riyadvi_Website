# Riyadvi Software Technologies: Website Revamp

A premium, dynamic, multi-page corporate website with interactive 3D, scroll-driven storytelling, a Node/Express API, MongoDB persistence and a protected admin dashboard. Built for the *Full Stack Developer interview assignment*.

> **Live URLs:** Frontend `<add Vercel URL>` · API `<add Render/Railway URL>/api/health` (deployment configs are included: see [Deployment](#deployment)).

## Contents
[Overview](#overview) · [Features](#features) · [Tech stack](#tech-stack) · [Installation](#installation) · [Environment variables](#environment-variables) · [Database setup](#database-setup) · [API endpoints](#api-endpoints) · [Deployment](#deployment) · [AI Tools Used](#ai-tools-used) · [3D libraries](#3d-libraries-used) · [Animation libraries](#animation-libraries-used) · [Third-party assets](#third-party-assets) · [Performance](#performance-optimization) · [Testing](#testing) · [Known limitations](#known-limitations) · [Future improvements](#future-improvements)

## Overview
Riyadvi is positioned as a **technology and digital solutions partner**, not a software vendor. The site funnels visitors to: *Book a Free Consultation*, *Contact*, *Get a Quote*, the *Business Health Checkup* and the *Software Project Planning Guide* download.

Design direction: true black and gold `#D4AF37`, Montserrat + Inter, blueprint-style registration marks, one memorable 3D hero and disciplined, content-first pages elsewhere. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the planning artefacts (folder structure, route map, schema, API contract, design tokens, 3D and performance plans) and [`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md) for a map of the code to the interview questions.

## Features
- **Routes:** `/`, `/services`, 6 × `/services/[slug]`, `/portfolio`, 10 × `/portfolio/[slug]`, `/about`, `/blog`, 6 × `/blog/[slug]`, `/careers`, 6 × `/careers/[slug]`, `/contact`, `/business-health-checkup`, `/software-project-planning-guide`, `/admin`.
- **Interactive 3D in five places:** home hero (connected data network), home services stage (one canvas, six scenes), service-page heroes, technology constellation, case-study device presentation (Wanaromah, Laxmi Astro AI).
- **Scroll storytelling:** pinned Business Challenge → Growth timeline (home); horizontal pinned company timeline (about); Lenis smooth scrolling.
- **Reusable architecture:** one service template, one case-study template, one job template, one article template; all read through `lib/content.ts`.
- **Lead capture (all persisted):** contact, consultation modal, six-step Business Health Checkup (with instant readiness score), planning-guide download, job applications with resume upload.
- **Blog:** featured article, categories, tags, search, related articles. **Careers:** department / designation / experience filters, detail pages, application form.
- **Contact extras:** WhatsApp link + floating button, Calendly embed (when configured), map, email notification via SMTP (when configured).
- **Admin dashboard:** JWT-protected; totals, per-type tables with search, status filter, status editing, detail view, resume download.
- **Accessibility:** semantic HTML, skip link, labelled forms with inline errors, keyboard-accessible modal/menus, focus states, reduced-motion support, ARIA on tabs/dialogs.
- **SEO:** per-page metadata, canonical URLs, sitemap, robots, Organization / BlogPosting / JobPosting JSON-LD.

## Tech stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3, zod |
| 3D | three, @react-three/fiber, @react-three/drei |
| Animation | GSAP + ScrollTrigger, Lenis, Motion (`motion/react`) |
| Backend | Node.js, Express 4, TypeScript, zod, multer, helmet, express-rate-limit, jsonwebtoken, bcryptjs, nodemailer |
| Database | MongoDB via Mongoose 8 |
| Fonts | Montserrat Variable + Inter Variable (self-hosted via Fontsource) |
| Hosting | Vercel (frontend), Render or Railway (API), MongoDB Atlas |

## Installation
Prerequisites: Node 18+ and a MongoDB instance (local or Atlas).
```bash
git clone <repo> && cd riyadvi-website

# 1. Backend
cd backend
cp .env.example .env          # edit values (see below)
npm install
npm run dev                   # http://localhost:5000  ->  GET /api/health

# 2. Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev                   # http://localhost:3000
```
Production build: `npm run build && npm start` in each folder.

## Environment variables
**backend/.env** (`backend/.env.example` documents every key)

| Key | Purpose |
|---|---|
| `MONGODB_URI` | Mongo connection string (**required in production**) |
| `CORS_ORIGINS` | Comma-separated allowed origins; wildcards OK, e.g. `https://*.vercel.app` |
| `JWT_SECRET` | ≥ 32 random chars (**required in production**) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | Admin login. Create the hash: `npm run hash-password -- "your-password"`. (`ADMIN_PASSWORD` is dev-only and refused in production.) |
| `SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM`, `NOTIFY_EMAIL` | Optional email notifications; skipped when `SMTP_HOST` is empty |

The server exits at start-up in production if secrets are missing or left at dev defaults.

**frontend/.env.local**

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and sitemap |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, international format |
| `NEXT_PUBLIC_CALENDLY_URL` | Optional; enables the Calendly embed and buttons |
| `NEXT_PUBLIC_MAP_EMBED_URL` | Optional map embed override |

Never commit `.env` files; they are git-ignored.

## Database setup
1. Create a MongoDB Atlas cluster (or run `mongod` locally) and set `MONGODB_URI`.
2. Collections are created automatically on first write: `contact_enquiries`, `consultation_requests`, `health_checkup_leads`, `lead_magnet_leads`, `career_applications` (schema in `docs/ARCHITECTURE.md` §D).
3. Optional demo data for the dashboard: `cd backend && npm run seed` (`-- --reset` removes earlier samples; they use the `@sample.riyadvi.dev` email domain).
4. Resumes are stored **inside MongoDB** (≤ 5 MB) so they survive ephemeral hosting disks.

## API endpoints
Base: `${NEXT_PUBLIC_API_URL}/api`. Envelope: `{ success, message, data }` or `{ success:false, error:{ code, message, fields? } }`.

| Method | Path | Body |
|---|---|---|
| GET | `/health` | – |
| POST | `/contact` | name, email, phone, company?, requirement, message |
| POST | `/consultation` | name, email, phone, company?, topic, preferredDate?, preferredTime?, message? |
| POST | `/health-checkup` | `business`, `digital`, `marketing`, `technology`, `challenges`, `consent` → returns `score`, `level`, `insights` |
| POST | `/lead-magnet` | name, company, email, phone → returns `downloadUrl` |
| POST | `/applications` | multipart: name, email, phone, position, jobSlug?, message?, `resume` (PDF/DOC/DOCX ≤ 5 MB) |
| POST | `/admin/login` | email, password → JWT (8 h) |
| GET | `/admin/stats` · `/admin/:collection` · `/admin/:collection/:id` | Bearer token |
| PATCH | `/admin/:collection/:id` | `{ status }` |
| GET | `/admin/applications/:id/resume` | Bearer token |

Every input is validated with zod on the server (and mirrored client-side), HTML-stripped, size-limited and rate-limited; forms include a honeypot; uploads are checked by extension, MIME type **and** file signature.

## Deployment
**API (Render):** New → Blueprint → select this repo (`render.yaml`), fill the `sync: false` variables. Railway: root `backend`, build `npm ci --include=dev && npm run build`, start `npm start`.
**Frontend (Vercel):** import the repo, set **Root Directory = `frontend`**, add the env vars above (with `NEXT_PUBLIC_API_URL` = the Render URL). Then add the Vercel domain to the API's `CORS_ORIGINS`.
Verify: open `<api>/api/health` (`db: "connected"`), submit the contact form, sign in at `/admin/login`.

## AI Tools Used
The brief requires this section to be an honest account of how AI was used. The complete initial implementation of this repository (architecture, code, sample copy, seed data, tests and documentation) was generated by **Claude** from the two supplied briefs. The candidate must complete the *manual work* rows below with what they personally review, change and debug before submitting; the assignment evaluates understanding, so do not submit this table unedited.

### Claude (Anthropic)
| | |
|---|---|
| **Purpose** | Plan the architecture; generate the Next.js frontend, R3F scenes, GSAP/Lenis/Motion animation, Express API, Mongoose models, zod validation, tests, seed script, planning-guide PDF and docs. |
| **Example prompt** | *"You are a senior full-stack engineer, creative frontend engineer and 3D web developer. Build a production-quality premium corporate website revamp for Riyadvi Software Technologies from the attached assignment and blueprint. Not a landing page: multi-page dynamic routing, reusable templates, meaningful 3D in at least three areas with a mobile strategy, backend + MongoDB, admin dashboard, live-deployable."* |
| **What was generated** | Everything in `frontend/`, `backend/`, `docs/`, `render.yaml`, this README; a contract test that runs the real frontend API client against the real API. |
| **What was manually changed** | *Candidate to fill in.* Suggested checklist: tune 3D visuals in a real browser and on real phones; replace draft case-study copy and milestones with verified facts; add real screenshots and brand assets; review every dependency; connect MongoDB, SMTP and Calendly; deploy; run Lighthouse and fix findings. |
| **Why selected** | Long-context reasoning across two briefs, and consistent output across front end, API and tests, with the option to run and verify code (build, type-check, 28 automated tests) instead of pasting unverified snippets. |

### Other tools (add if you use them)
Copy the table above for each: e.g. Cursor / Copilot for edits, Midjourney or Firefly for imagery, Blender/Spline for custom models, and note prompt, output, manual changes and rationale.

## 3D libraries used
`three` · `@react-three/fiber` (React renderer) · `@react-three/drei` (`Float`, `RoundedBox`, `Line`, `OrbitControls`, `Html`, `Environment` + `Lightformer`). All geometry is procedural, so there are no model files or textures to download.

## Animation libraries used
`gsap` + `ScrollTrigger` (pinned scroll storytelling, horizontal timeline) · `lenis` (smooth scroll on GSAP's ticker) · `motion` (nav indicator, tabs, modal, form steps, score ring) · CSS keyframes for the hero headline. Combined with the 3D stack, that is seven technologies, each visibly used.

## Third-party assets
- Fonts: Montserrat and Inter (SIL Open Font License) via `@fontsource-variable/*`.
- No stock images, models or textures. Client visuals are generated UI compositions in each client's accent colour; **replace them with real screenshots** (`Project.images`).
- Company contact details and the 2021 / TechBehemoths 2025 facts come from Riyadvi's public listings; verify them before launch.
- The Planning Guide PDF is original content generated for this project.

## Performance optimization
- three.js is **not** in the initial bundle (`next/dynamic`, `ssr:false`); home ≈ 214 kB first-load JS, service/portfolio pages ≈ 165 kB.
- Device tiers (`static` / `low` / `high`): no WebGL at all for data-saver or very low-memory devices; capped DPR, half the geometry and no orbit controls on phones.
- Render loops pause off-screen and in background tabs; `prefers-reduced-motion` renders a single frame and disables pinning and smooth scroll.
- Instancing for nodes and packets, procedural lighting (no HDR fetch), one canvas shared by six service scenes.
- Static generation for all detail pages, self-hosted variable fonts, CSS-only hero text animation, `optimizePackageImports`.
- Touch: canvases use `touch-action: pan-y` and skip OrbitControls on coarse pointers so the page always scrolls.

## Testing
```bash
cd backend && npm test      # 28 tests: validation, sanitising, uploads, auth, CORS, error shapes,
                            # and a frontend<->backend contract test (option lists == server enums)
cd frontend && npm run typecheck && npm run build && npm run lint
```
MongoDB is stubbed in the automated tests (Mongoose schema validation still runs).

## Known limitations
- **Not yet deployed and not yet run against a real MongoDB or in a real browser.** In the build environment there was no database or browser, so persistence and WebGL visuals were verified structurally (typecheck, production build, route smoke tests, API contract tests) but **not by eye**. Expect to tune camera framing, scale and colours once you see the scenes.
- Case-study copy, milestones after 2021/2025, jobs and blog posts are **sample content**; results are qualitative on purpose (no invented metrics).
- Admin token lives in `sessionStorage` (simple, cross-origin friendly); an httpOnly-cookie session behind a same-site API domain would be stronger.
- Rate limiting uses in-memory storage (per instance); use a Redis store when scaling out.
- Content lives in typed files behind `lib/content.ts`; there is no CMS yet.
- `deviceorientation` (gyro) parallax for phones was not implemented.
- Calendly and SMTP are optional and untested without credentials.

## Future improvements
Real screenshots and custom Blender/Spline models (Draco-compressed glTF); headless CMS (Sanity/Strapi) behind `lib/content.ts`; Playwright e2e and Lighthouse CI; email auto-replies and CRM webhook; httpOnly cookie auth with roles; i18n; analytics and consent banner; image pipeline for case-study galleries; Redis-backed rate limiting.
