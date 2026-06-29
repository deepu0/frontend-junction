import 'server-only';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient, User } from '@supabase/supabase-js';

const ADMIN_ROLES = ['admin', 'superadmin'] as const;

export interface AuthState {
  user: User | null;
  role: string | null;
  isAdmin: boolean;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/**
 * The single server-side Supabase client factory.
 * Full cookie read/write so session refresh works in route handlers
 * and server actions. (In Server Components, writes are no-ops — that's fine,
 * middleware refreshes the session.)
 */
export async function getServerSupabase(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            /* called from a Server Component — middleware handles refresh */
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            /* called from a Server Component */
          }
        },
      },
    }
  );
}

/**
 * Returns the verified user (validated against the Supabase Auth server via
 * getUser()). Use this for ALL authorization decisions — never getSession(),
 * which only reads the (potentially forged) cookie without verifying the JWT.
 */
export async function getVerifiedUser(
  client?: SupabaseClient
): Promise<User | null> {
  const supabase = client ?? (await getServerSupabase());
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

/**
 * Resolves the full auth state with the canonical admin rule:
 * admin if app_metadata.role OR users.user_role is in {admin, superadmin}.
 * This is the ONE place role resolution lives.
 */
export async function getAuthState(): Promise<AuthState> {
  const supabase = await getServerSupabase();
  const user = await getVerifiedUser(supabase);

  if (!user) {
    return { user: null, role: null, isAdmin: false };
  }

  // 1. Prefer the role embedded in the verified JWT.
  let role: string | null = (user.app_metadata as any)?.role ?? null;

  // 2. Fall back to the users table when the JWT has no admin role.
  if (!role || !ADMIN_ROLES.includes(role as any)) {
    const { data: profile } = await supabase
      .from('users')
      .select('user_role')
      .eq('id', user.id)
      .maybeSingle();
    role = profile?.user_role ?? role;
  }

  const isAdmin = role != null && ADMIN_ROLES.includes(role as any);
  return { user, role, isAdmin };
}

/**
 * Guard for API routes and server actions. Returns the AuthState when the
 * caller is an admin; otherwise throws AuthError (401 if unauthenticated,
 * 403 if authenticated but not admin).
 */
export async function requireAdmin(): Promise<AuthState> {
  const state = await getAuthState();
  if (!state.user) throw new AuthError('Unauthorized', 401);
  if (!state.isAdmin) throw new AuthError('Forbidden', 403);
  return state;
}
