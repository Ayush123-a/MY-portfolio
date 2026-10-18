# integration.md — Third-Party Integrations

## 1. Overview
| Integration | Purpose | Required? |
|---|---|---|
| Email (Resend/SendGrid) | Contact form notifications | Yes |
| LLM provider | AI assistant | Yes |
| GitHub API | Auto-pull repo info | Optional |
| Analytics (Plausible/GA) | Traffic insight | Optional |
| Error tracking (Sentry) | Runtime errors | Recommended |
| Storage/CDN (S3/Cloudinary) | Images | Optional |
| CAPTCHA (Turnstile) | Spam protection | Optional |

## 2. Email
```ts
await resend.emails.send({
  from: "Portfolio <noreply@yourdomain.com>",
  to: process.env.ADMIN_EMAIL!,
  subject: `New message from ${name}`,
  text: message,
});
```
- Verify domain (SPF, DKIM) for deliverability.
- Fail gracefully: save to DB even if email fails.

## 3. LLM Provider
- Wrap provider in `lib/llm.ts` so it can be swapped.
- Set timeouts (30 s), retries (2, exponential backoff), and token caps.
- Log latency and token usage (no personal data).

## 4. GitHub
- Use a read-only fine-grained token.
- Cache responses (e.g. 1 hour) to avoid rate limits.
- Fields used: name, description, stars, languages, README.

## 5. Analytics
Privacy-friendly by default; no cookies. Track: page views, project clicks, contact submissions, chat opens.

## 6. Webhooks (optional)
| Event | Action |
|---|---|
| GitHub push | Revalidate project pages |
| New contact message | Notify via Slack/Discord |

Verify webhook signatures; ignore unsigned requests.

## 7. Integration Pattern
```
Feature → Service wrapper (lib/*) → Provider SDK
```
Benefits: easy mocking in tests, single place for retries/logging, swap providers without touching features.

## 8. Failure Handling
| Failure | Behaviour |
|---|---|
| Email down | Save message, retry job, show success to user |
| LLM down | Show "assistant unavailable" + contact link |
| GitHub rate limit | Serve cached data |

## 9. Testing Integrations
Mock providers in unit tests; use sandbox keys in staging; run a smoke test per integration after deploy.
