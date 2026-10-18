# testing-and-qa.md — Testing & QA

## 1. Strategy (Test Pyramid)
| Level | Tool | Coverage target |
|---|---|---|
| Unit | Vitest/Jest | Utilities, validators, services (≥ 80%) |
| Integration | Vitest + test DB / Supertest | API routes + DB |
| Component | Testing Library | Key UI components |
| E2E | Playwright | Critical user flows |
| Accessibility | axe, Lighthouse | Every page |
| Security | `npm audit`, ZAP, manual | Pre-release |
| AI evals | Custom eval script | Agent quality |

## 2. Critical User Flows (E2E)
1. Home → Projects → filter → open detail.
2. Submit contact form (valid + invalid).
3. Open chat → ask question → receive answer.
4. Admin login → create/edit/delete project.
5. Unauthenticated access to `/admin` is blocked.

## 3. Example Tests
```ts
// unit
test("slugify", () => expect(slugify("Hello World!")).toBe("hello-world"));

// integration
test("GET /api/projects returns published only", async () => {
  const res = await request(app).get("/api/projects");
  expect(res.status).toBe(200);
  expect(res.body.data.every((p) => p.published)).toBe(true);
});
```
```ts
// e2e (Playwright)
test("contact form submits", async ({ page }) => {
  await page.goto("/contact");
  await page.fill("[name=name]", "Test");
  await page.fill("[name=email]", "t@example.com");
  await page.fill("[name=message]", "Hello");
  await page.click("button[type=submit]");
  await expect(page.getByText("Message sent")).toBeVisible();
});
```

## 4. AI Agent Evaluation
- 30+ question set with expected facts.
- Metrics: accuracy, hallucination rate, refusal correctness, latency.
- Adversarial prompts: injection, jailbreaks, off-topic, PII fishing.
- Re-run on every prompt/model change.

## 5. Performance Budget
| Metric | Target |
|---|---|
| LCP | < 2.5 s |
| CLS | < 0.1 |
| INP | < 200 ms |
| JS per page | < 200 KB gzipped |

## 6. Accessibility Checks
- Keyboard-only walkthrough of every page.
- Screen reader spot-check (NVDA/VoiceOver).
- Contrast and zoom (200%) verified.

## 7. CI Pipeline
```
lint → type-check → unit → integration → build → e2e (preview) → deploy
```
Block merges on failure.

## 8. Cross-Browser/Device Matrix
Chrome, Firefox, Safari, Edge · iOS Safari, Android Chrome · 360 px to 1440 px widths.

## 9. Bug Report Template
```md
**Title:**
**Environment:** browser/OS/device
**Steps to reproduce:**
**Expected vs actual:**
**Screenshots/logs:**
**Severity:** blocker / major / minor
```

## 10. Release Checklist
- [ ] All tests green
- [ ] Lighthouse ≥ 90
- [ ] Security checklist done
- [ ] Agent evals pass
- [ ] Broken-link check
- [ ] Backups verified
