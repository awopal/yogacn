# yogacn

An MVP workspace for yoga teachers to plan classes, teach from a focused sequence, preserve post-class reflections, and keep private student-observation timelines. The interface and demo content are in English.

## Getting started

Node.js 20+ and pnpm are recommended. The project also passes its checks on Node 18.20.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

When the API URL is empty, yogacn runs against its local demo mode and provides sample plans such as Core & Control, Hanumanasana Flow, Gentle Balance, and Weekend Reset. Demo data lives in server memory, resets when the development server restarts, and is never mixed with production data.

## API setup

1. Start the backend API from its own repository.
2. Copy `.env.example` to `.env` and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

When the API URL is not configured, the frontend uses its local demo data and cookie-based demo role session.

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

- `app/` contains the Next.js App Router pages, route handlers, and UI components.
- `lib/http/client.ts` is the shared boundary for requests to the backend API.
- `lib/auth/session.ts` owns the local demo session until the backend API auth flow is connected.
- `lib/server/demo.ts` keeps explicit demo data separate from API operations.
- `styles/` contains the StyleX design-system styles and tokens.
- `public/fonts` contains the locally served CommitMono 400/700 regular and italic faces used by the interface.

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

The planner uses accessible move-up and move-down controls instead of drag-and-drop. Wake lock depends on browser support. API mutations and authorization are owned by the separate backend repository. Booking, payments, memberships, marketplaces, and AI-generated sequences remain out of scope.
