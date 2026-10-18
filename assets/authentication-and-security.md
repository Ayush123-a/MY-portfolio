# authentication-and-security.md — Authentication & Security

## 1. Access Model
| Role | Access |
|---|---|
| Visitor (anonymous) | Public pages, contact form, chat |
| Admin (me) | Admin dashboard, content CRUD, messages |

Only one admin account exists; there is no public sign-up.

## 2. Authentication
- Email + password, hashed with **argon2id** (or bcrypt cost ≥ 12).
- Server-side sessions in an **HttpOnly, Secure, SameSite=Lax** cookie.
- Session expiry: 7 days, rotate on login.
- Login rate limit: 5 attempts / 15 min / IP, then lockout delay.
- Optional: TOTP 2FA for admin.

## 3. Authorization
- Middleware protects `/admin/*` and `/api/admin/*`.
- Deny by default; check role on every admin handler.

## 4. Input Validation
- Validate every request body with a schema library (e.g. Zod).
- Use the ORM's parameterised queries (no string-built SQL).
- Sanitise any rendered Markdown/HTML (prevent XSS).

## 5. Web Security Headers
```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: DENY
```
- CSRF protection on state-changing routes (SameSite + token).
- CORS: same-origin only unless explicitly needed.

## 6. Secrets Management
- Keep secrets in env vars / host secret store, never in Git.
- Rotate API keys periodically and after any suspected leak.
- Use separate keys for dev/staging/production.

## 7. AI & Agent Security
- **Prompt injection:** treat user input and tool output as untrusted; never let them change system rules.
- **Tool allow-list:** public agents get read-only tools only.
- **No secrets in prompts**; no private data in tool responses.
- **Output filtering:** limit length and strip unsafe markup.
- **Rate limit** chat and cap token usage per session.

## 8. Contact Form Abuse
Honeypot field, rate limit, optional CAPTCHA, email validation.

## 9. Privacy
- Store minimal data; hash IPs; no third-party tracking without consent.
- Provide privacy notice; delete old messages on schedule.

## 10. Dependency & Infra Hygiene
- Automated dependency updates + `npm audit` in CI.
- Lock file committed; review new packages.
- HTTPS everywhere; DB not publicly exposed; least-privilege DB user.

## 11. Security Checklist (pre-launch)
- [ ] Headers verified (securityheaders.com)
- [ ] Admin routes tested unauthenticated → 401/403
- [ ] XSS/SQLi/CSRF tests done
- [ ] Rate limits working
- [ ] Secrets scan clean
- [ ] Backups tested
