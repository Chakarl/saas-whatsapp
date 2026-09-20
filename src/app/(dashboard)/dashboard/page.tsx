import { createServerSupabase } from '@/lib/supabase-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Bot, CreditCard, Wifi } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    redirect('/login');
  }

  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!tenant || tenantError) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-red-600">Erro ao carregar dados</h1>
        <p className="text-gray-500 mt-2">
          Erro: {tenantError?.message || 'Tenant não encontrado'}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          User ID: {user.id}
        </p>
      </div>
    );
  }

  const usagePercent = tenant.limite_mensagens_mes > 0
    ? Math.round((tenant.mensagens_usadas / tenant.limite_mensagens_mes) * 100)
    : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Bem-vindo, {tenant.nome}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Mensagens
            </CardTitle>
            <MessageSquare size={18} className="text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {tenant.mensagens_usadas}/{tenant.limite_mensagens_mes}
            </p>
            <Progress value={usagePercent} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Plano
            </CardTitle>
            <CreditCard size={18} className="text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{tenant.plano}</p>
            <p className="text-sm text-gray-500 mt-1 capitalize">
              {tenant.plano_status}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              WhatsApp
            </CardTitle>
            <Wifi size={18} className="text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {tenant.instance_status === 'connected' ? '🟢' : '🔴'}
            </p>
            <p className="text-sm text-gray-500 mt-1 capitalize">
              {tenant.instance_status || 'Não conectado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Agente
            </CardTitle>
            <Bot size={18} className="text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {tenant.nome_agente_personalizado || 'Assistente'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {tenant.ativo ? '✅ Ativo' : '❌ Inativo'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}