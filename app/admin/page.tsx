import AdminDashboard from '@/components/admin-dashboard';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthState } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin Panel | Frontend Junction',
  description: 'Moderate and manage community submissions.',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const { isAdmin } = await getAuthState();

  if (!isAdmin) {
    redirect('/');
  }

  return <AdminDashboard isAdminOverride />;
}
