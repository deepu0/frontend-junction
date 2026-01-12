import AdminDashboard from '@/components/admin-dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Frontend Junction',
  description: 'Moderate and manage community submissions.',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
