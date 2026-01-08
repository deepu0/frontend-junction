'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useLoading } from './common/loader';
import type { User } from '@supabase/supabase-js';

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
  setUser: (user: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setLoading } = useLoading();
  const [user, setUser] = useState<UserProfile | null>(null);
  const supabase = getSupabaseBrowserClient();

  const fetchUserProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      return data as UserProfile | null;
    },
    [supabase]
  );

  useEffect(() => {
    const initSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    };

    initSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, setLoading, fetchUserProfile]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
