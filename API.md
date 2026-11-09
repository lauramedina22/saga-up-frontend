# Backend API

## Configuration

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` — PostgreSQL connection for the shared `saga_up` schema.
- `SECURITY_SERVER_URL` — base URL of the external authentication service.
  **Required for every business route.** When unset, every protected request
  fails with `503 Authentication service is not configured`.
- `HOST`, `PORT` — networking.

```bash
npm run dev
npm run build
npm start
```

To add endpoints for another model, follow the
[endpoint creation tutorial](./TUTORIAL-ENDPOINTS.md).

## Authentication

All business routes require a Bearer token issued by the external
authentication service documented in [`SECURITY_SERVER.md`](./SECURITY_SERVER.md).
The token is **opaque** (random session identifier — not a JWT), hashed in
the auth service's database, and expires 8 hours after issue.

For every protected request this backend forwards the token to
`GET <SECURITY_SERVER_URL>/auth/perfil` and only continues if that call
answers `200`. The parsed profile is attached to `req.user` for downstream
handlers. The middleware is implemented in
[`src/middleware/auth.ts`](src/middleware/auth.ts).

Request header:

```http
Authorization: Bearer <session-token>
```

Error mapping:

| HTTP | Reason |
|---|---|
| `401` | `Authorization` header missing, malformed, or rejected by `/auth/perfil` |
| `403` | `/auth/perfil` answered `403` for the token |
| `502` | `/auth/perfil` was unreachable or returned an unexpected status/body |
| `503` | `SECURITY_SERVER_URL` is not configured in this deployment |

### Role-based authorization — **not yet implemented**

Role gates (such as "only ADMIN can create staff" or "only ACUDIENTE can
read their own child") are **not** wired up. Before adding them we need:

1. The documented JSON shape of `GET /auth/perfil` (the current parser is
   defensive but role lookup is best-effort).
2. A written permission matrix (role × resource × action).
3. A mapping between the authenticated user's id and the business rows
   (`staff.staff_id`, `guardians.guardian_id`, `professionals.professional_id`).
   There is no column linking them today, so we cannot filter by owner.

Until these are agreed, every authenticated caller can access every
business row. Do not document a route as role-protected unless its handler
actually enforces the role.

## Conventions

- `BigInt` ids are serialized as strings in responses.
- Audit columns (`created_at`, `created_by`, `updated_at`, `updated_by`) are
  never read from the request body. `updated_at` is refreshed on writes.
- Unknown fields in request bodies return `400`.
- Filter query parameters named below accept positive integers (`BigInt`)
  as strings.

| HTTP | Reason |
|---|---|
| `400` | Invalid input (bad body/id, unknown fields, broken FK) |
| `404` | Record not found (Prisma `P2025`) |
| `409` | Uniqueness or relation conflict (`P2002`, `P2003`) |
| `503` | Database unavailable (`P10*`) |

## Public routes (no auth)

| Method | Path | Description |
|---|---|---|
| `GET` | `/test-connection` | `200 {status, database}` or `503` |
| `GET` | `/health` | Same as `/test-connection` |

## `/guardians` and `/api/guardians`

**Requires authentication.** Both paths expose the same handlers.

| Method | Path | Description |
|---|---|---|
| `GET` | `/guardians` | Lists guardians, with document type and legal status |
| `GET` | `/guardians/:id` | Gets a guardian by `guardian_id` |
| `POST` | `/guardians` | Creates a guardian |
| `PUT` | `/guardians/:id` | Replaces editable fields |
| `PATCH` | `/guardians/:id` | Partial update |
| `DELETE` | `/guardians/:id` | Hard delete |

| Field | Type | Requirement |
|---|---|---|
| `full_name` | string | Required for `POST`/`PUT`; non-empty |
| `document_type_id` | positive integer or `null` | FK `document_types` |
| `document_number` | string or `null` | — |
| `phone` | string or `null` | — |
| `address` | string or `null` | — |
| `legal_status_id` | positive integer or `null` | FK `legal_statuses` |

```json
POST /guardians
{
  "full_name": "Ana Perez",
  "document_type_id": "1",
  "document_number": "123456789",
  "phone": "3001234567",
  "address": "Main Street 1",
  "legal_status_id": "1"
}
```

## `/staff`

**Requires authentication.**

| Method | Path | Description |
|---|---|---|
| `GET` | `/staff` | Lists staff with document type, role, contract, status |
| `GET` | `/staff/:id` | Gets by `staff_id` |
| `POST` | `/staff` | Creates staff |
| `PUT` | `/staff/:id` | Replace |
| `PATCH` | `/staff/:id` | Partial update |
| `DELETE` | `/staff/:id` | **Soft delete** — sets `exit_date` if null |

| Field | Type | Requirement |
|---|---|---|
| `full_name` | string | Required for `POST`/`PUT` |
| `document_type_id` | positive integer or `null` | FK |
| `document_number` | string or `null` | — |
| `staff_role_id` | positive integer or `null` | FK. Roles whose `code` is `ADMIN`/`ADMINISTRADOR`/`SUPER_ADMIN`/`SUPERADMIN` are rejected with `403` to prevent self-assigning the admin role from a non-admin context |
| `hire_date` | ISO date or `null` | — |
| `contract_type_id` | positive integer or `null` | FK |
| `staff_status_id` | positive integer or `null` | FK |
| `phone` | string or `null` | — |
| `email` | string or `null` | Basic email validation |
| `exit_date` | ISO date or `null` | **Only on `PUT`/`PATCH`** |

Admin protection: staff already carrying an admin role cannot be modified
through `PUT`/`PATCH`/`DELETE`; the request returns `403`. `hours_worked`
and `hours_payed` are never read from the request body.

## `/children`

**Requires authentication.**

| Method | Path | Description |
|---|---|---|
| `GET` | `/children` | Lists with sex, document type, status |
| `GET` | `/children/:id` | Gets by `child_id` |
| `POST` | `/children` | Creates |
| `PUT` | `/children/:id` | Replace |
| `PATCH` | `/children/:id` | Partial update |
| `DELETE` | `/children/:id` | **Soft delete** — sets `exit_date` if null |

| Field | Type | Requirement |
|---|---|---|
| `first_name` | string | Required for `POST`/`PUT` |
| `last_name` | string | Required for `POST`/`PUT` |
| `birth_date` | ISO date or `null` | — |
| `sex_id` | positive integer or `null` | FK `sexes` |
| `document_type_id` | positive integer or `null` | FK |
| `document_number` | string or `null` | — |
| `admission_date` | ISO date or `null` | — |
| `child_status_id` | positive integer or `null` | FK `child_statuses` |
| `notes` | string or `null` | — |
| `exit_date` | ISO date or `null` | **Only on `PUT`/`PATCH`** |

## `/children-guardians`

**Requires authentication.** Join between `children` and `guardians`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/children-guardians` | Lists all links |
| `GET` | `/children-guardians/:id` | Gets by `child_guardian_id` |
| `POST` | `/children-guardians` | Creates link |
| `PUT` | `/children-guardians/:id` | Replace |
| `PATCH` | `/children-guardians/:id` | Partial update |
| `DELETE` | `/children-guardians/:id` | Hard delete |

| Field | Type | Requirement |
|---|---|---|
| `child_id` | positive integer | Required; FK `children` |
| `guardian_id` | positive integer | Required; FK `guardians` |
| `guardianship_type_id` | positive integer or `null` | FK |
| `start_date` | ISO date or `null` | — |
| `end_date` | ISO date or `null` | Must be ≥ `start_date` |

## `/professionals`

**Requires authentication.** Workshop teachers (`talleristas`).

| Method | Path | Description |
|---|---|---|
| `GET` | `/professionals` | Lists with linked staff |
| `GET` | `/professionals/:id` | Gets by `professional_id` |
| `POST` | `/professionals` | Create (optionally with nested `staff`) |
| `PUT` | `/professionals/:id` | Replace |
| `PATCH` | `/professionals/:id` | Partial update |
| `DELETE` | `/professionals/:id` | Hard delete (409 if still referenced) |

| Field | Type | Requirement |
|---|---|---|
| `staff_id` | positive integer or `null` | Mutually exclusive with `staff` |
| `staff` | object or `null` | `POST` only. Inline staff payload. Admin block list applies here too |
| `titles` | string or `null` | — |
| `institutions` | string or `null` | — |
| `observations` | string or `null` | — |
| `time_donor` | boolean | Default `false` |

## `/professionals-workshops`

**Requires authentication.** Association between a professional and a workshop.

| Method | Path | Description |
|---|---|---|
| `GET` | `/professionals-workshops` | Lists. Filters `?professional_id=&workshop_id=` |
| `GET` | `/professionals-workshops/:id` | Gets by `professional_workshop_id` |
| `POST` | `/professionals-workshops` | Creates association |
| `PUT` | `/professionals-workshops/:id` | Replace |
| `PATCH` | `/professionals-workshops/:id` | Partial update |
| `DELETE` | `/professionals-workshops/:id` | Hard delete; **409** if there are related `children_assistance` rows |

| Field | Type | Requirement |
|---|---|---|
| `professional_id` | positive integer | Required for `POST`/`PUT`; FK `professionals` |
| `workshop_id` | positive integer | Required for `POST`/`PUT`; FK `workshops` |
| `day_week` | string or `null` | — |
| `ends_on` | ISO date or `null` | When `null`, duplicate active associations for the same pair are rejected with `409` |
| `time_starts` | `HH:MM[:SS]` or `null` | — |
| `time_ends` | `HH:MM[:SS]` or `null` | — |
| `observations` | string or `null` | — |

```json
POST /professionals-workshops
{
  "professional_id": "2",
  "workshop_id": "7",
  "day_week": "martes",
  "time_starts": "09:00",
  "time_ends": "10:30"
}
```

## `/workshops`

**Requires authentication.**

| Method | Path | Description |
|---|---|---|
| `GET` | `/workshops` | List |
| `GET` | `/workshops/:id` | By `workshop_id` |
| `POST` | `/workshops` | Create |
| `PUT` | `/workshops/:id` | Replace |
| `PATCH` | `/workshops/:id` | Partial update |
| `DELETE` | `/workshops/:id` | Hard delete |

| Field | Type | Requirement |
|---|---|---|
| `name` | string | Required for `POST`/`PUT` |
| `duration_minutes` | non-negative integer or `null` | — |
| `description` | string or `null` | — |
| `workshop_supplies` | string or `null` | — |

## `/tuition`

**Requires authentication.** Monthly tuition fees.

| Method | Path | Description |
|---|---|---|
| `GET` | `/tuition` | List |
| `GET` | `/tuition/:id` | By `tuition_fee_id` |
| `POST` | `/tuition` | Create |
| `PUT` | `/tuition/:id` | Replace |
| `PATCH` | `/tuition/:id` | Partial update |
| `DELETE` | `/tuition/:id` | Hard delete |

| Field | Type | Requirement |
|---|---|---|
| `child_id` | positive integer or `null` | FK `children` |
| `amount` | positive integer (COP) or `null` | — |
| `paid_date` | ISO date or `null` | — |
| `payment_method_id` | positive integer or `null` | FK |
| `tuition_status_id` | positive integer or `null` | FK |

## `/children-assistance`

**Requires authentication.** Workshop attendance of a child.

| Method | Path | Description |
|---|---|---|
| `GET` | `/children-assistance` | List. Filters `?child_id=&professional_workshop_id=` |
| `GET` | `/children-assistance/:id` | By `children_assistance_id` |
| `POST` | `/children-assistance` | Create |
| `PUT` | `/children-assistance/:id` | Replace |
| `PATCH` | `/children-assistance/:id` | Partial update |
| `DELETE` | `/children-assistance/:id` | Hard delete |

| Field | Type | Requirement |
|---|---|---|
| `child_id` | positive integer | Required for `POST`/`PUT`; FK `children` |
| `professional_workshop_id` | positive integer | Required for `POST`/`PUT`; FK `professionals_workshops` |
| `will_assist` | boolean or `null` | Expected to attend |
| `attended` | boolean or `null` | Actually attended |
| `complete_workshop` | boolean or `null` | Finished the session |
| `behavior` | string or `null` | Free-text notes |

The pair `(child_id, professional_workshop_id)` is unique
(`children_assistance_uniq`); duplicates return `409`.

```json
POST /children-assistance
{
  "child_id": "12",
  "professional_workshop_id": "3",
  "will_assist": true,
  "attended": true,
  "complete_workshop": false,
  "behavior": "participativo"
}
```

## `/staff-assistance`

**Requires authentication.** Daily staff clock-in/clock-out as decimal hours.

| Method | Path | Description |
|---|---|---|
| `GET` | `/staff-assistance` | List. Filters `?staff_id=&date_working=YYYY-MM-DD` |
| `GET` | `/staff-assistance/:id` | By `staff_assistance_id` |
| `POST` | `/staff-assistance` | Create |
| `PUT` | `/staff-assistance/:id` | Replace |
| `PATCH` | `/staff-assistance/:id` | Partial update |
| `DELETE` | `/staff-assistance/:id` | Hard delete |

| Field | Type | Requirement |
|---|---|---|
| `staff_id` | positive integer | Required for `POST`/`PUT`; FK `staff` |
| `date_working` | ISO date or `null` | — |
| `time_in` | decimal `[0, 999.99]` with ≤2 decimals, or `null` | Column is `Decimal(5,2)`; business meaning (hours vs. 24h time) not fixed in schema |
| `time_out` | decimal `[0, 999.99]` with ≤2 decimals, or `null` | Same |

The schema stores `time_in`/`time_out` as `Decimal(5,2)`; no automatic
hours-worked calculation is performed. Decide the semantics before using
the field, and keep audit columns server-managed.

```json
POST /staff-assistance
{
  "staff_id": "5",
  "date_working": "2026-10-26",
  "time_in": "8.00",
  "time_out": "17.30"
}
```

## `/child-records`

**Requires authentication.** Child health/follow-up records. **No `DELETE`**:
historical records must be preserved and the schema has no soft-delete
column; adding one requires a schema change and sign-off.

| Method | Path | Description |
|---|---|---|
| `GET` | `/child-records` | List. Filter `?child_id=` |
| `GET` | `/child-records/:id` | By `record_id` |
| `POST` | `/child-records` | Create |
| `PUT` | `/child-records/:id` | Replace (cannot change `child_id` / `recorded_by`) |
| `PATCH` | `/child-records/:id` | Partial update (same restriction) |

| Field | Type | Create | Update |
|---|---|---|---|
| `child_id` | positive integer | Required | **Not editable** |
| `recorded_by` | positive integer or `null` | FK `staff` | **Not editable** |
| `eps` | string or `null` | — | — |
| `state` | string or `null` | — | — |
| `ips_assigned` | string or `null` | — | — |
| `allergies` | string or `null` | — | — |
| `meal_restrictions` | string or `null` | — | — |
| `medicines` | string or `null` | — | — |
| `special_conditions` | string or `null` | — | — |

```json
POST /child-records
{
  "child_id": "12",
  "recorded_by": "5",
  "eps": "Sura",
  "state": "activo",
  "allergies": "maní",
  "medicines": null
}
```

## `/child-internal-descriptions`

**Requires authentication.** Confidential internal description of a child.
**No `DELETE`**: same rationale as `/child-records`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/child-internal-descriptions` | List. Filter `?child_id=` |
| `GET` | `/child-internal-descriptions/:id` | By `child_internal_description_id` |
| `POST` | `/child-internal-descriptions` | Create |
| `PUT` | `/child-internal-descriptions/:id` | Replace (cannot change `child_id`) |
| `PATCH` | `/child-internal-descriptions/:id` | Partial update (same restriction) |

| Field | Type | Create | Update |
|---|---|---|---|
| `child_id` | positive integer | Required | **Not editable** |
| `communication_ways` | string or `null` | — | — |
| `daily_routine_help` | string or `null` | — | — |
| `likings` | string or `null` | — | — |
| `crisis_management` | string or `null` | — | — |
| `previous_institution` | string or `null` | — | — |
| `grade` | string or `null` | — | — |
| `therapies` | string or `null` | — | — |

Because the content is confidential, these endpoints will remain gated by
`requireAuth`. Once per-role or per-child access policies are agreed, a
narrower middleware should be added on top.

## Pending — Donor model

The `saga_up` Prisma schema does **not** define donors. The only related
field is `professionals.time_donor`. Implementing `POST /donors` requires
either a new `donors` model (schema change) or an explicit decision to
repurpose `professionals`. No endpoint ships without that agreement.

## Testing

- `npm run typecheck` — TypeScript diagnostics.
- `npm run test:unit` — pure unit tests for parsers and the auth
  middleware; no database or network access (`createRequireAuth(fetchProfile)`
  injects a mock).
- `npm test` — runs both.

Database-backed integration tests are **not** included because the project
Supabase instance is shared with teammates. Any integration suite must run
against an isolated database with its own `DATABASE_URL`.
