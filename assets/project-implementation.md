# project-implementation.md — Implementation Plan

## Phase 0 — Planning (Week 1)
- [ ] Finalise `PRO.md` scope
- [ ] Wireframes + design tokens (`design.md`)
- [ ] Repo, branches, CI skeleton

## Phase 1 — Foundation (Week 2)
- [ ] Scaffold Next.js + TypeScript + Tailwind
- [ ] ESLint, Prettier, Husky, commit lint
- [ ] Layout, navbar, footer, theme toggle
- [ ] Deploy empty site to hosting

## Phase 2 — Content Pages (Week 3)
- [ ] Home, About, Projects list/detail
- [ ] Static data first (JSON/MDX), then DB
- [ ] SEO: meta tags, sitemap, OG images

## Phase 3 — Backend & Data (Week 4)
- [ ] Prisma schema + migrations + seed
- [ ] REST endpoints (`api.md`)
- [ ] Contact form + email notification

## Phase 4 — Auth & Admin (Week 5)
- [ ] Login, sessions, route protection
- [ ] Admin CRUD for projects/posts

## Phase 5 — AI & MCP (Week 6–7)
- [ ] MCP server exposing portfolio data
- [ ] Portfolio Guide agent + chat UI
- [ ] Guardrails + evaluation set

## Phase 6 — Quality & Launch (Week 8)
- [ ] Unit/integration/E2E tests
- [ ] Accessibility + performance audit
- [ ] Security review
- [ ] Custom domain, analytics, monitoring
- [ ] Launch 🎉

## Definition of Done (per task)
Code reviewed · tests pass · docs updated · accessible · deployed to preview.

## Risks
| Risk | Mitigation |
|---|---|
| Scope creep | Freeze v1 scope in `PRO.md` |
| LLM cost spikes | Rate limits + caching |
| Prompt injection | Guardrails + tool allow-list |
| Time shortage | Ship static MVP first |
