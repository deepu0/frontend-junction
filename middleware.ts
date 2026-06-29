import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware responsibilities:
 *  1. Refresh the Supabase auth session cookie on each request.
 *  2. Protect authenticated-only routes (currently /add-experience).
 *
 * Authorization for admin areas is enforced in the routes/pages themselves
 * via lib/auth (requireAdmin / getAuthState), not here.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // getUser() verifies the JWT with the auth server (secure) and refreshes
  // the session cookie via the set() handler above.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected route: must be signed in.
  if (pathname === '/add-experience' && !user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/add-experience'],
};
