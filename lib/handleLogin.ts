import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

interface HandleLoginParams {
  provider: 'google' | 'github' | 'facebook' | 'gitlab' | 'bitbucket';
  redirectTo: string;
}

const isProduction = process.env.NODE_ENV === 'production';

const handleLogin = async ({ provider, redirectTo }: HandleLoginParams) => {
  const supabase = getSupabaseBrowserClient();

  try {
    const fullRedirectUrl = isProduction
      ? `https://www.frontend-junction.com${redirectTo}`
      : `${location.origin}${redirectTo}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: fullRedirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('Error signing in with OAuth:', error.message);
    throw error;
  }
};

export default handleLogin;
