# Interview walkthrough cheat-sheet

Where to look in the code for each of the nine walkthrough questions in the brief. Read the files, run the project, and be ready to explain **why**, not just **what**.

| # | Question | Start here | Key idea to be able to explain |
|---|---|---|---|
| 1 | Design | `frontend/tailwind.config.ts`, `app/globals.css`, `docs/ARCHITECTURE.md` §F | True-black + gold "blueprint" language; registration marks; restraint outside the hero |
| 2 | 3D | `components/three/*` | R3F scene graph, instancing, `useFrame` damping, why one canvas for six services |
| 3 | AI | README → *AI Tools Used* | Which parts were generated, what you verified/changed |
| 4 | Development | `git log --oneline` | Milestone commits; what you'd hand-write vs generate |
| 5 | Architecture | `lib/api.ts` → `backend/src/routes` → `controllers` → `services` → `models` | Request path from a form to a MongoDB document |
| 6 | Dynamic content | `data/*.ts`, `lib/content.ts`, `ServiceTemplate.tsx`, `app/**/[slug]/page.tsx` | Add a service/project/post/job = add one object; swapping to a CMS = re-implement `lib/content.ts` |
| 7 | Performance | `hooks/useQualityTier.ts`, `SceneCanvas.tsx`, `CanvasHost.tsx` | Tiers, pausing, lazy three.js, reduced motion |
| 8 | Challenges | see *Known limitations* | e.g. ScrollTrigger pin vs. transformed ancestors; touch-action on canvases; SSR vs. WebGL |
| 9 | Production | README → *Future improvements* | CMS, real screenshots, e2e tests, Lighthouse CI, real asset pipeline |

## Try these to prove you understand it
1. Add a seventh service (`data/services.ts` + a slug in `backend` `SERVICES`) and watch the page, nav, footer and sitemap appear.
2. Change `useQualityTier` thresholds and observe the hero's node count on a phone emulator.
3. Trace `POST /api/health-checkup` end-to-end: `HealthCheckupForm.tsx` → `schemas.ts` → `lead.service.ts` → `healthScore.service.ts` → `HealthCheckup` model.
4. Break the CORS origin in `.env` and read the error the form shows.
5. Run `npm test` in `backend/`, then break an enum in `schemas.ts` and see the contract test fail.
