'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Check, Loader2, CreditCard, Sparkles, Gift } from 'lucide-react';

const plansData = [
  { id: 'free', name: 'Free', price: 0, messages: '50', limit: 50, free: true },
  { id: 'starter', name: 'Starter', price: 97, messages: '500', limit: 500 },
  { id: 'pro', name: 'Pro', price: 197, messages: '2.000', limit: 2000, popular: true },
  { id: 'business', name: 'Business', price: 397, messages: '5.000', limit: 5000 },
  { id: 'enterprise', name: 'Enterprise', price: 797, messages: 'Ilimitadas', limit: 999999 },
];

export default function PlanPage() {
  const [planoAtual, setPlanoAtual] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: tenant } = await supabase
      .from('tenants')
      .select('plano')
      .eq('user_id', user.id)
      .single();

    if (tenant) setPlanoAtual(tenant.plano);
  }

  async function handleSelectPlan(planId: string) {
    setLoading(planId);

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: planId }),
      });

      const data = await res.json();

      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
        return;
      }

      alert(data.error || 'Erro ao processar. Tente novamente.');
    } catch {
      alert('Erro ao processar. Tente novamente.');
    }

    setLoading(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Escolha seu plano</h1>
        <p className="text-sm text-gray-400 mt-1">Upgrade ou downgrade a qualquer momento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {plansData.map((plan) => {
          const isAtual = planoAtual === plan.id;
          const isFree = 'free' in plan && plan.free;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                plan.popular
                  ? 'border-blue-500 shadow-blue-100'
                  : isFree
                    ? isAtual
                      ? 'border-emerald-500'
                      : 'border-emerald-400 shadow-emerald-50'
                    : isAtual
                      ? 'border-emerald-500'
                      : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
                  Mais popular
                </div>
              )}

              {isFree && !isAtual && (
                <div className="absolute -top-3 left-4 inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                  <Gift size={10} /> GRÁTIS
                </div>
              )}

              {isAtual && !plan.popular && (
                <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  Plano atual
                </div>
              )}

              <div className="mb-4 mt-1">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {isFree ? 'R$ 0' : `R$ ${plan.price}`}
                  <span className="text-sm font-normal text-gray-400">
                    {isFree ? '/7 dias' : '/mês'}
                  </span>
                </p>
              </div>

              <div className="space-y-2.5 mb-6">
                {(isFree
                  ? ['50 mensagens', '1 agente IA', '7 dias de teste', 'Sem cartão de crédito']
                  : [
                      `${plan.messages} mensagens/mês`,
                      'Agente personalizado',
                      'WhatsApp 24h',
                      'Suporte por WhatsApp',
                    ]
                ).map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-emerald-500" />
                    </div>
                    <span className="text-xs text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isAtual || loading === plan.id}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isAtual
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isFree
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20'
                      : plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {loading === plan.id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : null}
                {isAtual ? 'Plano atual' : isFree ? 'Começar grátis' : 'Assinar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}