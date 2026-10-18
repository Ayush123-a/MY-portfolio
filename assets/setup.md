# setup.md — Local Setup

## Prerequisites
- Node.js ≥ 20, npm/pnpm
- PostgreSQL 15+ (or Docker)
- Git
- API keys: LLM provider, email provider (optional)

## 1. Clone & Install
```bash
git clone https://github.com/<you>/<repo>.git
cd <repo>
npm install
```

## 2. Environment Variables
```bash
cp .env.example .env.local
```
| Variable | Description |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/portfolio` |
| `SESSION_SECRET` | Random 32+ char string |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin account |
| `LLM_API_KEY` | AI provider key |
| `EMAIL_API_KEY` | Email service key |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |

> Never commit `.env*` files (already in `.gitignore`).

## 3. Database
```bash
docker run --name pg -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres:15
npx prisma migrate dev
npx prisma db seed
```

## 4. Run
```bash
npm run dev        # http://localhost:3000
```

## 5. Useful Scripts
| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint |
| `npm test` | Unit/integration tests |
| `npm run test:e2e` | End-to-end tests |
| `npx prisma studio` | Browse DB |

## 6. Deployment
1. Push to `main` → CI runs tests.
2. Hosting (e.g. Vercel) builds and deploys.
3. Set the same env vars in the host dashboard.
4. Run `npx prisma migrate deploy` against production DB.

## 7. Troubleshooting
See [debugging.md](debugging.md).
