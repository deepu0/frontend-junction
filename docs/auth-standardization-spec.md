# Spec: Auth Standardization

## Problem

Authentication and authorization logic is duplicated and inconsistent across the
codebase, causing real bugs (admin routes silently 403'd because different files
checked admin status differently). Authorization decisions use the insecure
`getSession()` instead of the verified `getUser()`.

## Goals

1. **Single source of truth** for auth: one module all server code imports from.
2. **Consistent admin rule** everywhere: a user is admin if
   `app_metadata.role ∈ {admin, superadmin}` OR `users.user_role ∈ {admin, superadmin}`.
3. **Secure authorization**: use `supabase.auth.getUser()` (server-verified) for
   any access-control decision, never `getSession()`.
4. **No dead code**: remove unused logout paths, dead middleware matchers, unused clients.
5. **No behavior regressions** for: logged-out users, normal users, admins,
   login, logout, OAuth callback.

## Non-Goals

- Changing the OAuth provider (stays Google).
- Changing the database schema.
- Building new auth features (password login, 2FA, etc.).

## Design

### Module: `lib/auth.ts` (server-only)

```ts
getServerSupabase()        // the ONE server client (full cookie read/write)
getVerifiedUser()          // supabase.auth.getUser() → User | null (verified)
getAuthState()             // { user, role, isAdmin } — resolves role via dual check
requireAdmin()             // returns AuthState if admin, else throws AuthError(403/401)
```

Role resolution (single implementation):
1. Read `user.app_metadata.role`.
2. If not admin/superadmin, query `users.user_role` for the user id.
3. `isAdmin = role ∈ {admin, superadmin}`.

### Consumers refactored to use the module

| File | Before | After |
|------|--------|-------|
| `app/admin/page.tsx` | inline dual check | `requireAdmin()` (redirect on fail) |
| `actions/admin.ts` | inline dual check | `requireAdmin()` |
| `app/api/admin/stats/route.ts` | app_metadata only | `requireAdmin()` |
| `app/api/pipeline/route.ts` | app_metadata only | `requireAdmin()` (OR cron token) |
| `app/api/auth/me/route.ts` | inline dual | `getAuthState()` |

### Client side

- `session-provider.tsx` keeps resolving role for UI hints, but the **authoritative**
  admin gate for nav is `/api/auth/me` (server truth). Header already does this.
- `profile.tsx`: remove dead `handleLogout`; keep the `/auth/signout` form. Admin
  panel link gated by the same `/api/auth/me` result passed down or its own fetch.

### Middleware

- Fix matcher: remove dead `/dashboard/:path*` (no such route).
- Keep `/add-experience` protection (auth required).
- Use `getUser()` for the check.
- Delete unused `utils/supabase/middleware.ts` (broken — returns response not client).

### Logout

- Single canonical path: POST `/auth/signout` (server signOut + redirect).
- `session-provider.signOut()` may remain for programmatic client logout but should
  delegate to the same outcome (signOut + redirect home).

## Acceptance Criteria

- [ ] One `lib/auth.ts` module; all server admin checks import `requireAdmin`/`getAuthState`.
- [ ] Zero `getSession()` calls used for authorization (replaced by `getUser()`).
- [ ] Admin rule identical in all 5 server consumers (verified by reading code).
- [ ] Logged-out user hitting `/admin` → redirected to `/`.
- [ ] Normal user hitting `/admin` → redirected to `/` (or unauthorized view).
- [ ] Admin user → `/admin`, `/admin/captured`, `/admin/ingest` accessible; nav links visible.
- [ ] `/api/auth/me` returns correct `{ isAdmin }` for all three states.
- [ ] Dead code removed: `/dashboard` matcher, `handleLogout`, unused middleware client.
- [ ] `npm run build` + `tsc --noEmit` pass.
- [ ] Verified against live DB: admin user resolves isAdmin=true via the new module.

## Risks

- Auth refactor can lock everyone out. Mitigation: keep changes additive where
  possible, verify build, and run a live DB check that the admin resolves correctly
  before considering done.
