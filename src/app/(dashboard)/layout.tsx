import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import { Sidebar } from '@/components/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!tenant) {
    redirect('/login');
  }

  if (tenant.plano_status === 'pending' || tenant.plano === 'pending') {
    redirect('/choose-plan');
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar tenant={tenant} />
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}