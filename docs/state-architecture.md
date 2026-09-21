# State architecture

## Current baseline

This is a Next.js 16.3.4 App Router application. There was no Redux, Context, React Query, SWR, or Zustand before this migration. Existing server components read demo data directly, while `ScheduleCalendar` and `YogiManager` read/write browser `localStorage` through small services.

The migration is intentionally incremental: server/API data remains outside Zustand, and small component-only interactions remain local `useState`.

## State placement

| Domain | Local UI | Zustand | Server state | URL state |
| --- | --- | --- | --- | --- |
| Auth/session | login form pending state | session identity/role UI model; reset on logout | backend API session, permissions, onboarding authority | optional return URL |
| Instructor profile | edit form fields | shared profile editor/availability draft | instructor profile and availability records | optional profile section |
| Yogis | add-yogi modal/input | search/filter, selected yogi | yogi records, notes, mutations | search/page/filter when shareable |
| Classes | modal/input details | selected class, class builder draft, Asana sequence | class list/details and saves | class id, mode, tab |
| Schedule | combo-box and attendance modal internals | date/view, filters, schedule draft, selected/editing/conflict UI | schedule records and conflict authority | date/week/view/filters |
| Dashboard | chart hover state | metric/date-range preferences only if shared | statistics and counts | date range/metric |
| Video/content | player controls and upload widget state | selected video and upload progress shared by widgets | videos, entitlements, access checks | video id |
| Purchase/enrollment | checkout steps/cart UI | cart and payment-step UI | purchase status, enrollment, entitlements | checkout/class id |

Do not copy yogi, class, schedule, purchase, statistics, permission, or access data into a global client store just to make it available. Those are authoritative server data and should be fetched with the eventual React Query/SWR/server-action layer, then invalidated after mutations. The current demo `localStorage` services are a temporary data boundary, not a reason to create a second cache.

## Stores

`lib/stores/class-builder-store.ts` owns one normalized draft. It supports section/item add, update, delete, and reorder without duplicating the saved class. `Planner` initializes the draft from route/page props and sends the draft to the API/server action in the next migration step.

`lib/stores/schedule-store.ts` owns schedule UI state and a typed schedule draft. The calendar records remain component data loaded by `scheduleService`; when the API is introduced, replace that service with server state and keep this store unchanged. `conflictIds` is UI feedback only; the server must re-check conflicts before saving.

`lib/stores/auth-store.ts` is a deliberately non-persisted client session model. Tokens, permissions, and personal data must not be persisted here. A logout/account switch should call `clearSession()` and the domain reset actions.

Use narrow selectors to avoid unnecessary renders:

```tsx
const dateFilter = useScheduleStore((state) => state.dateFilter);
const setFilter = useScheduleStore((state) => state.setFilter);
```

Avoid selecting a freshly-created object unless using `useShallow`. Stores are client-only modules and must only be imported by Client Components. Persist should be added only for harmless preferences or explicitly recoverable drafts, with hydration-safe rendering.

## Save flow

1. Validate a builder/schedule payload at the client boundary with Zod.
2. Submit through an API route or server action.
3. Re-check authorization and schedule conflicts on the server.
4. Invalidate/refetch the affected server queries (`classes`, `schedules`, `yogis`, or `statistics`).
5. Reset the draft after a confirmed success; keep it after an error so the instructor can retry.

Recommended next schemas: `classSchema`, `scheduleSchema`, `yogiSchema`, and `purchaseSchema`, shared only where server and client validation truly have the same contract.

## Future domains

Video should keep player time/playing/volume local unless multiple controls need the same state; upload progress can live in a content store, while signed URLs and access checks remain server-owned. Cart and payment step can live in a purchase store, but payment/purchase status must always be confirmed by the payment provider/server. Enrollment and content access should be derived from server entitlements, never from a client boolean.

## Suggested folder structure

```text
lib/
  stores/
    auth-store.ts
    class-builder-store.ts
    schedule-store.ts
  server/                 # queries, mutations, authorization
  schemas/                # Zod contracts
  services/               # API/client boundaries
app/
  ...                     # Server Components by route
  components/             # Client Components at interaction boundaries
```

## Migration checklist

- [x] Add typed Zustand stores without persisting sensitive state.
- [x] Move class-builder draft and schedule UI state out of page components.
- [x] Keep yogi/class/schedule records at their existing data boundary.
- [ ] Add server query/mutation layer and cache invalidation.
- [ ] Add auth provider/session hydration and role guards.
- [ ] Add Zod schemas and server-side conflict/permission checks.
