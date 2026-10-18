# debugging.md — Debugging & Troubleshooting

## 1. Debugging Method
1. **Reproduce** reliably.
2. **Isolate** (frontend? API? DB? integration?).
3. **Inspect** logs, network, state.
4. **Hypothesise** one cause; change one thing.
5. **Fix** and add a regression test.
6. **Document** the cause below if non-obvious.

## 2. Where to Look
| Layer | Tool |
|---|---|
| Browser | DevTools (Console, Network, Performance) |
| Server | Terminal logs, host log viewer |
| DB | `npx prisma studio`, `EXPLAIN ANALYZE` |
| Errors | Sentry stack traces |
| AI | Prompt/response logs, tool-call traces |

## 3. Common Issues
### Setup
| Problem | Fix |
|---|---|
| `ECONNREFUSED` to DB | Start Postgres; check `DATABASE_URL` |
| Prisma client out of date | `npx prisma generate` |
| Env var undefined | Restart dev server; `NEXT_PUBLIC_` prefix for client vars |
| Port 3000 in use | `npx kill-port 3000` or change port |

### Frontend
| Problem | Fix |
|---|---|
| Hydration mismatch | Avoid `Date.now()`/`window` during SSR; use `useEffect` |
| Stale data | Check cache/revalidate settings |
| Layout shift | Set image width/height; reserve space |

### API / Auth
| Problem | Fix |
|---|---|
| 401 on admin routes | Cookie not set (Secure flag on http?), session expired |
| 429 | Rate limit hit; check limiter keys |
| CORS error | Confirm origin and headers |

### AI / MCP
| Problem | Fix |
|---|---|
| Agent hallucinates | Tighten prompt, require tool use, add eval case |
| Tool not called | Check tool description/schema; log tool list |
| MCP server silent | Log to stderr (stdout breaks stdio protocol) |
| Slow replies | Cache, smaller model, limit history length |
| Prompt injection seen | Strengthen guardrails, review tool allow-list |

## 4. Logging Guidelines
- Use levels: `debug`, `info`, `warn`, `error`.
- Include request ID, route, duration.
- Never log passwords, tokens, or full personal data.

```ts
logger.error({ requestId, route, err }, "Failed to create project");
```

## 5. Handy Commands
```bash
npm run build && npm start        # reproduce prod behaviour
npx prisma migrate status         # migration state
npx tsc --noEmit                  # type errors
npx playwright test --debug       # step through e2e
npx playwright show-trace trace.zip
```

## 6. Production Incident Checklist
1. Confirm impact (uptime monitor, error tracker).
2. Roll back to last good deploy if needed.
3. Check recent changes, env vars, provider status pages.
4. Fix forward with a test.
5. Write a short post-mortem.

## 7. Post-Mortem Template
```md
**Date/Duration:**
**Impact:**
**Root cause:**
**Fix:**
**Prevention:**
```

## 8. Known Issues Log
| Date | Issue | Cause | Resolution |
|---|---|---|---|
| | | | |
