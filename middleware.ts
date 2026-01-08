import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  /* Debug logging for auth */
  // console.log(`[Middleware] Path: ${pathname}`);
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    // console.log(`[Middleware] Session found for user: ${data.session.user.id}`);
    // Check role safely by querying the database
    // We only need to check role for specific protected routes or if we want to enforce admin access globally for some paths
    // Current logic seemed to safeguard everything that wasn't /add-experience?
    // The original logic was: if /add-experience, allow. Else check role === admin.
    // This implies ALL other routes required admin? That seems wrong for a public site.
    // Reviewing config matcher: ['/dashboard/:path*', '/add-experience']

    if (pathname.startsWith('/dashboard')) {
      // Dashboard is likely admin only
      const { data: userProfile } = await supabase
        .from('users')
        .select('user_role')
        .eq('id', data.session.user.id)
        .single();

      if (
        userProfile?.user_role !== 'admin' &&
        userProfile?.user_role !== 'superadmin'
      ) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // /add-experience is protected but allowed for any authenticated user (already handled by session check)
    if (pathname === '/add-experience') {
      return response;
    }
  } else {
    // No session
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/add-experience'],
};
