# api.md — API Reference

**Base URL:** `/api` · **Format:** JSON · **Auth:** session cookie (admin routes only)

## Conventions
- Success: `200/201` with `{ "data": ... }`
- Error: `{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }`
- Pagination: `?page=1&limit=10` → `{ data, meta: { page, limit, total } }`
- Rate limit: 60 req/min per IP (chat: 10/min)

## Public Endpoints
| Method | Path | Description |
|---|---|---|
| GET | `/api/projects` | List published projects (`?tag=`, `?featured=true`) |
| GET | `/api/projects/:slug` | Project detail |
| GET | `/api/posts` | List blog posts |
| GET | `/api/posts/:slug` | Single post |
| POST | `/api/contact` | Send contact message |
| POST | `/api/chat` | Chat with AI assistant (streamed) |

## Admin Endpoints (auth required)
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| POST | `/api/admin/projects` | Create project |
| PATCH | `/api/admin/projects/:id` | Update project |
| DELETE | `/api/admin/projects/:id` | Delete project |
| GET | `/api/admin/messages` | List contact messages |

## Examples
### POST /api/contact
```json
// request
{ "name": "Asha", "email": "asha@example.com", "message": "Let's talk!" }
// 201 response
{ "data": { "id": "uuid", "status": "received" } }
```

### POST /api/chat
```json
// request
{ "sessionId": "abc123", "message": "What is your best project?" }
// response: text/event-stream
data: {"type":"token","value":"My strongest project is..."}
data: {"type":"done"}
```

## Error Codes
| Code | HTTP | Meaning |
|---|---|---|
| VALIDATION_ERROR | 400 | Bad input |
| UNAUTHORIZED | 401 | Not logged in |
| FORBIDDEN | 403 | Not allowed |
| NOT_FOUND | 404 | Missing resource |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
