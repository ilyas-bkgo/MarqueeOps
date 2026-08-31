# Security policy

## Supported versions

Security fixes are applied to the latest version on `main`.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Contact the project owner privately with a concise reproduction, impact assessment, and any proposed mitigation. Acknowledgement should be provided within five business days.

## Deployment requirements

- Set a unique `JWT_SECRET` of at least 32 characters through your hosting provider's secret manager.
- Use HTTPS at the load balancer or reverse proxy.
- Keep `NODE_ENV=production`; it disables demo persona switching and demo-data reset.
- Put the application behind a managed identity provider or implement an authentication issuer before exposing it to users.
- Replace the local JSON data store with a transactional, backed-up database before storing real customer data.
- Restrict Gemini API keys by environment and monitor their usage.
