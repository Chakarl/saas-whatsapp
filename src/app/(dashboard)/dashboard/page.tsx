import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { MessageSquare, Bot, CreditCard, Wifi, TrendingUp, Zap } from 'lucide-react';

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
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl">
        <h1 className="text-lg font-bold">Erro ao carregar dados</h1>
        <p className="text-sm mt-1">{tenantError?.message || 'Tenant não encontrado'}</p>
      </div>
    );
  }

  const usagePercent = tenant.limite_mensagens_mes > 0
    ? Math.round((tenant.mensagens_usadas / tenant.limite_mensagens_mes) * 100)
    : 0;

  const isConnected = tenant.instance_status === 'connected';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {tenant.nome?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Aqui está o resumo do seu agente hoje
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Mensagens */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mensagens</span>
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageSquare size={16} className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {tenant.mensagens_usadas.toLocaleString('pt-BR')}
            <span className="text-sm font-normal text-gray-400">
              /{tenant.limite_mensagens_mes.toLocaleString('pt-BR')}
            </span>
          </p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{usagePercent}% utilizado</p>
        </div>

        {/* Plano */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Plano</span>
            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
              <CreditCard size={16} className="text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 capitalize">{tenant.plano}</p>
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              tenant.plano_status === 'active'
                ? 'bg-emerald-50 text-emerald-600'
                : tenant.plano_status === 'overdue'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-amber-50 text-amber-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                tenant.plano_status === 'active'
                  ? 'bg-emerald-500'
                  : tenant.plano_status === 'overdue'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
              }`} />
              {tenant.plano_status === 'active' ? 'Ativo' : tenant.plano_status === 'overdue' ? 'Vencido' : 'Pendente'}
            </span>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">WhatsApp</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isConnected ? 'bg-emerald-50' : 'bg-red-50'
            }`}>
              <Wifi size={16} className={isConnected ? 'text-emerald-500' : 'text-red-400'} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {isConnected ? 'Online' : 'Offline'}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {isConnected ? '🟢 Agente respondendo' : '🔴 Conecte seu número'}
          </p>
        </div>

        {/* Agente */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Agente</span>
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Bot size={16} className="text-indigo-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 truncate">
            {tenant.nome_agente_personalizado || 'Assistente'}
          </p>
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              tenant.ativo ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${tenant.ativo ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {tenant.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/dashboard/whatsapp"
            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow">
              <Zap size={18} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{isConnected ? 'Ver conexão' : 'Conectar WhatsApp'}</p>
              <p className="text-xs text-gray-400">{isConnected ? 'Gerenciar' : 'Escanear QR Code'}</p>
            </div>
          </a>

          <a
            href="/dashboard/agent"
            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow">
              <Bot size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Personalizar agente</p>
              <p className="text-xs text-gray-400">Nome, tom e regras</p>
            </div>
          </a>

          <a
            href="/dashboard/usage"
            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow">
              <TrendingUp size={18} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Ver uso</p>
              <p className="text-xs text-gray-400">Mensagens e limites</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}