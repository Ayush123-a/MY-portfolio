# feature-development.md — Feature Development Workflow

## 1. Lifecycle
`Idea → Spec → Branch → Build → Test → Review → Merge → Deploy → Monitor`

## 2. Feature Spec Template
```md
### Feature: <name>
**Problem:** What user problem does it solve?
**User story:** As a <who>, I want <what>, so that <why>.
**Acceptance criteria:**
- [ ] ...
**API/DB changes:** ...
**UI changes:** link to design
**Security/privacy notes:** ...
**Test plan:** ...
```

## 3. Git Workflow
- `main` — production, always deployable
- `feat/<name>`, `fix/<name>`, `docs/<name>` — short-lived branches
- Conventional commits: `feat: add project filter`, `fix: contact form validation`
- Pull requests: small, linked to an issue, with screenshots.

## 4. PR Checklist
- [ ] Meets acceptance criteria
- [ ] Tests added/updated and passing
- [ ] Lint/type-check clean
- [ ] Accessible (keyboard, contrast)
- [ ] Docs updated (`api.md`, `database.md`, etc.)
- [ ] No secrets or debug code

## 5. Feature Flags
Use env-based flags for risky features (e.g. `FEATURE_AI_CHAT=true`) so they can be disabled without redeploying code.

## 6. Example: Adding "Project Filter by Tag"
1. **Spec:** filter grid by tag; URL `?tag=react`.
2. **DB:** index on `project_tags(tag_id)`.
3. **API:** `GET /api/projects?tag=react`.
4. **UI:** tag chips above the grid; selected state.
5. **Tests:** API filters correctly; E2E click tag → grid updates.
6. **Docs:** update `api.md`.

## 7. Release & Rollback
- Merge to `main` → auto deploy preview → promote.
- Rollback: redeploy previous build; revert migration only if backward-incompatible.

## 8. Backlog Ideas
Blog search · RSS · testimonials · multi-language · analytics dashboard.
