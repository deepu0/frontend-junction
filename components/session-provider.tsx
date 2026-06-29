'use client';
import { createContext, use, useEffect, useState, useMemo, useCallback } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import type { Session, User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  display_name?: string;
  email?: string;
  image_url?: string;
  role?: string;
  stripe_customer_id?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Convert Supabase User to UserProfile
const userToProfile = (user: User): UserProfile => ({
  id: user.id,
  email: user.email,
  display_name:
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0],
  image_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
  role:
    (user.app_metadata as any)?.role ||
    user.user_metadata?.role ||
    undefined,
});

// Resolve a full profile, falling back to the users table for the role
// when it is not present in the JWT (app_metadata/user_metadata).
const resolveProfile = async (
  supabase: ReturnType<typeof getSupabaseBrowserClient>,
  user: User
): Promise<UserProfile> => {
  const profile = userToProfile(user);
  if (!profile.role) {
    try {
      const { data } = await supabase
        .from('users')
        .select('user_role')
        .eq('id', user.id)
        .maybeSingle();
      if (data?.user_role) profile.role = data.user_role;
    } catch {
      /* ignore — role stays undefined */
    }
  }
  return profile;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  // Sign out handler
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.push('/');
  }, [supabase, router]);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (mounted && currentSession) {
          setSession(currentSession);
          const profile = await resolveProfile(supabase, currentSession.user);
          if (mounted) setUser(profile);
        }
      } catch (err) {
        console.error('[Auth] Error getting session:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, newSession: any) => {
      if (!mounted) return;

      if (newSession) {
        setSession(newSession);
        const profile = await resolveProfile(supabase, newSession.user);
        if (mounted) setUser(profile);
      } else {
        setSession(null);
        setUser(null);
      }

      setIsLoading(false);

      // Clear code from URL after successful auth
      if (event === 'SIGNED_IN' && window.location.search.includes('code=')) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const contextValue = useMemo(
    () => ({ user, session, isLoading, setUser, signOut }),
    [user, session, isLoading, signOut]
  );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};
