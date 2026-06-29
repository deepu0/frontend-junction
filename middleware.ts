import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware responsibilities:
 *  1. Refresh the Supabase auth session cookie on every request.
 *  2. Protect authenticated-only routes (currently /add-experience).
 *
 * Authorization for admin areas is enforced in the routes/pages themselves
 * via lib/auth (requireAdmin / getAuthState), not here.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Use a single mutable response — never reinitialise it inside callbacks
  // or Supabase may drop multi-chunk session cookies.
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Write to both request and response so downstream code sees the
          // refreshed token, and the browser receives the updated cookie.
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // getUser() verifies the JWT with the auth server (secure) and triggers
  // session refresh when the token is close to expiry, writing the new
  // token via the set() handler above.
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
  // Run on all page routes so that session tokens are refreshed site-wide.
  // Exclude static assets, image optimisation, and Next.js internals.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
