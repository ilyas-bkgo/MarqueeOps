# MarqueeOps

MarqueeOps is a client operations command center for boutique marketing agencies. It brings portfolio health, team access, activity history, retainer visibility, and optional Gemini-assisted account insights into one workspace.

> **Current release status:** the repository has production-oriented HTTP security, validation, tests, CI, and container support. It is still a reference implementation until a real identity provider and transactional database are connected. Do not store real client data in its local JSON store.

## Features

- React 19 + TypeScript client-operations workspace
- Server-enforced role permissions for agency owners, operators, and viewers
- Team access management with operational activity history
- Request validation, payload limits, security headers, and API rate limiting
- Optional Gemini insight generation, with a local analytical fallback
- Health endpoint, automated API tests, GitHub Actions CI, and Docker build

## Quick start

Prerequisites: Node.js 22+ and npm.

```bash
cp .env.example .env
npm ci
npm run dev
```

Open `http://localhost:3000`. The standard interface is framed as an agency workspace; internal development-only role preview endpoints remain disabled when `NODE_ENV=production`.

## Commands

```bash
npm run dev       # Start the development server
npm run lint      # Type-check the project
npm test          # Run API tests
npm run build     # Build client and server bundles
npm start         # Run the production bundle
```

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | Production | Set to `production` for deployment. This disables demo identities and seed reset. |
| `PORT` | No | Server port; defaults to `3000`. |
| `JWT_SECRET` | Production | At least 32 random characters. Store it in your platform secret manager. |
| `GEMINI_API_KEY` | No | Enables Gemini insight generation. The local fallback works without it. |
| `GEMINI_MODEL` | No | Gemini model identifier; defaults to `gemini-3.7-flash`. |

Generate a suitable signing secret with:

```bash
openssl rand -base64 48
```

## API

All `/api/*` endpoints except `/health` require authentication. In development, demo personas are allowed to make the UI explorable. In production, callers must supply a valid bearer JWT:

```text
Authorization: Bearer <token>
```

| Endpoint | Access | Description |
| --- | --- | --- |
| `GET /health` | Public | Load-balancer health check |
| `GET /api/session` | Authenticated | Current identity |
| `GET /api/metrics` | Authenticated | Dashboard metrics |
| `GET /api/users` | Authenticated | User directory |
| `POST /api/users` | Admin+ | Create a user |
| `PUT /api/users/:id` | Admin+ | Update profile details |
| `PATCH /api/users/:id/role` | Super Admin | Change role |
| `PATCH /api/users/:id/status` | Admin+ | Change lifecycle status |
| `DELETE /api/users/:id` | Admin+ | Delete a user, subject to hierarchy rules |
| `GET /api/activities?limit=100` | Authenticated | Audit activity (1–100 records) |
| `GET /api/insights` | Authenticated | Current insights |
| `POST /api/insights/generate` | Admin+ | Refresh insights |

`POST /api/session/switch` and `POST /api/seed/reset` are development-only demo routes and return `404` in production.

## Deployment baseline

Build and run the container:

```bash
docker build -t marqueeops .
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET="$(openssl rand -base64 48)" \
  marqueeops
```

Before a real launch, complete these non-optional integrations:

1. Replace `server/db.ts` local JSON storage with PostgreSQL (including migrations, backups, encryption, and tenant isolation).
2. Use a managed identity provider (for example Auth0, Clerk, or an OIDC provider) and validate issuer, audience, expiry, and key rotation rather than self-issued JWTs.
3. Add a session/login UI, password-reset/MFA flows if you own authentication, and an authorization model tied to database identities.
4. Configure HTTPS, a custom domain, monitoring/error tracking, structured logs, database backups, and alerting in your hosting platform.
5. Run a security review and add end-to-end tests against a staging environment.

See [SECURITY.md](SECURITY.md) for operational security guidance and [CONTRIBUTING.md](CONTRIBUTING.md) for the local contribution workflow.

## License

Distributed under the [MIT License](LICENSE).
