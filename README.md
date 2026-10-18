# Kenan Kuşçu Portfolio

Cloudflare Workers, D1, Tailwind CSS and Vanilla JavaScript based bilingual portfolio with a protected admin panel.

## Local development

Requirements: Node.js 20+ and a Cloudflare account for remote deployment.

```bash
npm install
cp .dev.vars.example .dev.vars
npm run db:local
npm run dev
```

The website is served at `http://localhost:5173` and the admin panel at `http://localhost:5173/admin`.

Admin secrets are read from `.dev.vars` locally and Cloudflare secrets in production. Passwords must use this format:

```text
pbkdf2_sha256$100000$BASE64URL_SALT$BASE64URL_HASH
```

## Database

The executable reference schema is in `schema.sql`. Versioned D1 migrations are in `migrations/`.

```bash
npm run db:local
npm run db:remote
```

The database contains:

- `projects`: bilingual project content, links, technologies, publication and ordering data.
- `skills`: skill names, bilingual categories, levels, publication and ordering data.
- `site_settings`: bilingual identity, introduction and contact values.

## Production deployment

1. Authenticate with `npx wrangler login`.
2. Create the database with `npx wrangler d1 create d1-portfolio-db`.
3. Replace the placeholder `database_id` in `wrangler.jsonc` with the returned ID.
4. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` and `ALLOWED_ORIGIN` using `npx wrangler secret put NAME`.
5. Apply the remote migration with `npm run db:remote`.
6. Deploy with `npm run deploy`. The command uses the Vite-generated Worker manifest so only `dist/client` is uploaded as static assets.

## Quality checks

```bash
npm test
npm run build
npm run test:e2e
```
