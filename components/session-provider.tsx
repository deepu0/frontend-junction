'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useLoading } from './common/loader';
interface AuthContextType {
  user: any; // Update the type according to your user data structure
  setUser: (user: any | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  return useContext(AuthContext)!;
};

export const AuthProvider = ({ children }: any) => {
  const { setLoading } = useLoading();
  const [user, setUser] = useState<any | null>(null); // Update the type according to your user data structure

  const supabase = createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    readSession();
  }, []);

  const readSession = async () => {
    setLoading(true);
    const { data: userSession, error } = await supabase.auth.getSession();

    if (error || !userSession) {
      setLoading(false);
      return;
    }

    if (userSession?.session) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userSession.session?.user.id)
        .single();
      setUser(data);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
