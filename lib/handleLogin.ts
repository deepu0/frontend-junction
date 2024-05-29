import { createBrowserClient } from '@supabase/ssr';

interface HandleLoginParams {
  provider: 'google' | 'github' | 'facebook' | 'gitlab' | 'bitbucket';
  redirectTo: string;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const isProduction = process.env.NODE_ENV === 'production';

const handleLogin = async ({ provider, redirectTo }: HandleLoginParams) => {
  try {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: isProduction
          ? `https://www.frontend-junction.com${redirectTo}`
          : `${location.origin}${redirectTo}`,
      },
    });
  } catch (error: any) {
    console.error('Error signing in with OAuth:', error.message);
    // Handle error as needed
  }
};

export default handleLogin;
