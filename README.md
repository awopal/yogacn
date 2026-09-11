# yogacn

An MVP workspace for yoga teachers to plan classes, teach from a focused sequence, preserve post-class reflections, and keep private student-observation timelines. The interface and demo content are in English.

## Getting started

Node.js 20+ and pnpm are recommended. The project also passes its checks on Node 18.20.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

When the Supabase variables are empty, yogacn displays a clear demo-mode notice and provides sample plans such as Core & Control, Hanumanasana Flow, Gentle Balance, and Weekend Reset. Demo data lives in server memory, resets when the development server restarts, and is never mixed with production data.

## Supabase setup

1. Create a Supabase project and open its SQL Editor.
2. Run `supabase/migrations/202608310001_initial_schema.sql`, or use `supabase db push` with a linked Supabase CLI project.
3. Copy `.env.example` to `.env` and set:

```env
PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

4. Create the initial teacher account under Supabase Dashboard → Authentication → Users, then sign in with email and password.

`SUPABASE_SERVICE_ROLE_KEY` is imported only from `src/lib/server/admin.ts`; it is never exposed to browser code or used in the standard request flow. Cookie-bound requests use the anonymous key and rely on RLS as the authorization boundary.

The migration includes UUID keys, foreign keys and cascades, enums, indexes, `updated_at` triggers, and RLS for every user-owned table. Child-table policies verify ownership through their parent plan or student. Student observations have no public-read policy.

## Commands

```bash
pnpm dev       # Start the development server
pnpm check     # Run TypeScript and Svelte diagnostics
pnpm lint      # Check Prettier formatting and ESLint
pnpm lint:fix  # Format and apply safe ESLint fixes
pnpm format    # Format with Prettier only
pnpm test      # Run Vitest
pnpm build     # Create a production build
```

### Format and lint on save in Zed

`.zed/settings.json` formats and applies ESLint fixes whenever a Svelte file is saved. It first runs the `source.fixAll.eslint` code action, then sends the buffer to Prettier through `pnpm exec prettier --stdin-filepath`. Install the Svelte and ESLint extensions in Zed and open this project directory as the workspace.

## Architecture

- `src/hooks.server.ts` creates the Supabase SSR client and validates the current user with the Auth server.
- `src/routes/+layout.server.ts` protects every route except `/login`.
- SvelteKit page loads and form actions provide the backend; there is no separate server or ORM.
- `src/lib/schemas.ts` contains shared Zod validation for plans, sections, items, reflections, students, and observations.
- `src/lib/server/demo.ts` keeps explicit demo data separate from database operations.
- `supabase/migrations` contains the deployable schema and RLS policies.
- `tailwind.config.ts` defines semantic design-system colors for light and dark surfaces.
- `static/fonts` contains the locally served CommitMono 400/700 regular and italic faces used by the interface.

The primary action color is available through `bg-primary`, `text-primary`, and related Tailwind utilities. Its value is `#57bc68`.

## Moon Days API

`GET /api/moon-days` returns the astronomical New Moon and Full Moon moments for a calendar year. It uses `astronomy-engine` phase searches, so the results are based on the actual phase event time rather than an illumination estimate.

Query parameters:

- `year` — optional integer from `1` to `9999`; defaults to the current UTC year.
- `timezone` — optional IANA timezone; defaults to `Asia/Bangkok`.

Example:

```bash
curl "http://localhost:3000/api/moon-days?year=2026&timezone=Asia%2FBangkok"
```

The response contains `year`, `timezone`, and a chronologically sorted `moonDays` array:

```json
{
  "year": 2026,
  "timezone": "Asia/Bangkok",
  "moonDays": [
    {
      "type": "new_moon",
      "eventTimeUtc": "2026-01-18T19:52:00.000Z",
      "eventTimeLocal": "2026-01-19T02:52:00+07:00",
      "localDate": "2026-01-19",
      "timezone": "Asia/Bangkok"
    }
  ]
}
```

The API returns astronomical event dates only. Which dates count as Ashtanga practice holidays can vary by lineage and location, so Moon Day observance should remain a separate business rule.

## Intentional MVP limitations

The planner uses accessible move-up and move-down controls instead of drag-and-drop. Wake lock depends on browser support. Nested Supabase plan writes currently use multiple statements; a production phase should move them into a database transaction/RPC and add end-to-end tests against local Supabase. Full duplication works in demo mode, while Supabase duplication is reserved for the next phase. Booking, payments, memberships, marketplaces, and AI-generated sequences remain out of scope.
