import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default async function UsagePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: tenant } = await supabase
    .from('tenants')
    .select('plano, mensagens_usadas, limite_mensagens_mes')
    .eq('user_id', user.id)
    .single();

  if (!tenant) return null;

  const usagePercent = tenant.limite_mensagens_mes > 0
    ? Math.round((tenant.mensagens_usadas / tenant.limite_mensagens_mes) * 100)
    : 0;

  const restantes = tenant.limite_mensagens_mes - tenant.mensagens_usadas;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Uso de Mensagens</h1>
        <p className="text-sm text-gray-400 mt-1">Acompanhe seu consumo mensal</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg">
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <BarChart3 size={18} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Plano <span className="capitalize">{tenant.plano}</span>
            </p>
            <p className="text-xs text-gray-400">
              {tenant.limite_mensagens_mes.toLocaleString('pt-BR')} mensagens/mês
            </p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Barra de progresso */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-gray-900">
                {tenant.mensagens_usadas.toLocaleString('pt-BR')}
              </span>
              <span className="text-gray-400">
                {tenant.limite_mensagens_mes.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">{usagePercent}% utilizado</p>
          </div>

          {/* Status */}
          {restantes > 0 ? (
            <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-4">
              <TrendingUp size={18} className="text-emerald-500" />
              <p className="text-sm text-emerald-700 font-medium">
                {restantes.toLocaleString('pt-BR')} mensagens restantes
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-red-50 rounded-xl p-4">
              <AlertTriangle size={18} className="text-red-500" />
              <p className="text-sm text-red-600 font-medium">
                Limite atingido — faça upgrade para continuar
              </p>
            </div>
          )}

          {/* Botão */}
          <Link
            href="/dashboard/plan"
            className="flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border-2 border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            {usagePercent >= 80 ? 'Fazer upgrade' : 'Ver planos'}
          </Link>
        </div>
      </div>
    </div>
  );
}