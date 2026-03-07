import AdminDashboard from '@/components/admin-dashboard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Panel | Frontend Junction',
  description: 'Moderate and manage community submissions.',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('user_role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (
    userProfile?.user_role !== 'admin' &&
    userProfile?.user_role !== 'superadmin'
  ) {
    redirect('/');
  }

  return <AdminDashboard isAdminOverride />;
}
