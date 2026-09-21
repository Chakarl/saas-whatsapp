'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Check, Loader2, QrCode, CreditCard, Sparkles, Gift } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0',
    priceCents: 0,
    messages: '50',
    features: ['1 agente IA', '50 mensagens', '7 dias de teste', 'Sem cartão de crédito'],
    free: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 'R$ 97',
    priceCents: 9700,
    messages: '500',
    features: ['1 agente IA', '500 mensagens/mês', 'Suporte por WhatsApp'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 197',
    priceCents: 19700,
    messages: '2.000',
    popular: true,
    features: ['1 agente IA', '2.000 mensagens/mês', 'Suporte prioritário', 'Base de conhecimento'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 'R$ 397',
    priceCents: 39700,
    messages: '5.000',
    features: ['1 agente IA', '5.000 mensagens/mês', 'Suporte dedicado', 'Base de conhecimento'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'R$ 797',
    priceCents: 79700,
    messages: 'Ilimitadas',
    features: ['1 agente IA', 'Mensagens ilimitadas', 'Suporte VIP', 'Tudo incluso'],
  },
];

export default function ChoosePlanPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [tenant, setTenant] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  // Verifica se já usou trial
  const jaUsouTrial =
    tenant?.plano_status === 'expired' ||
    tenant?.trial_expires_at !== null;

  useEffect(() => {
    loadTenant();
  }, []);

  async function loadTenant() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { data } = await supabase
      .from('tenants')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!data) { router.push('/register'); return; }

    if (data.plano_status === 'active' && data.plano !== 'pending' && data.plano !== 'free') {
      router.push('/dashboard');
      return;
    }

    setTenant(data);
  }

  async function handleSubscribe(plan: typeof plans[0]) {
    // Bloquear Free se já usou trial
    if (plan.free) {
      if (jaUsouTrial) {
        alert('Você já utilizou o período gratuito. Escolha um plano pago para continuar.');
        return;
      }

      setLoading(plan.id);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('tenants').update({
        plano: 'free',
        plano_status: 'trial',
        ativo: true,
        mensagens_usadas: 0,
        limite_mensagens_mes: 50,
        trial_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }).eq('user_id', user.id);

      router.push('/dashboard');
      return;
    }

    setLoading(plan.id);

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: plan.id, billingType: paymentMethod }),
      });

      const data = await res.json();

      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      } else {
        alert(data.error || 'Erro ao criar cobrança. Tente novamente.');
      }
    } catch {
      alert('Erro ao processar. Tente novamente.');
    }

    setLoading(null);
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="animate-spin text-blue-500" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 mb-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Escolha seu plano</h1>
          <p className="text-gray-400 mt-2">
            Olá, {tenant.nome?.split(' ')[0]}! Ative seu agente agora.
          </p>
        </div>

        {/* Pagamento */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setPaymentMethod('PIX')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 transition-all duration-200 ${
              paymentMethod === 'PIX'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <QrCode size={18} />
            <div className="text-left">
              <p className="text-sm font-semibold">PIX</p>
              <p className="text-[11px] opacity-70">Aprovação instantânea</p>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('CREDIT_CARD')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 transition-all duration-200 ${
              paymentMethod === 'CREDIT_CARD'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <CreditCard size={18} />
            <div className="text-left">
              <p className="text-sm font-semibold">Cartão de Crédito</p>
              <p className="text-[11px] opacity-70">Recorrência automática</p>
            </div>
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border p-6 transition-all duration-200 hover:shadow-md ${
                plan.popular
                  ? 'border-blue-500 border-2 shadow-sm shadow-blue-500/10'
                  : plan.free
                    ? jaUsouTrial
                      ? 'border-gray-200 opacity-60'
                      : 'border-emerald-400 border-2 shadow-sm shadow-emerald-500/10'
                    : 'border-gray-100 shadow-sm'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                  <Sparkles size={10} /> MAIS POPULAR
                </span>
              )}

              {plan.free && !jaUsouTrial && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                  <Gift size={10} /> GRÁTIS
                </span>
              )}

              {plan.free && jaUsouTrial && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gray-400 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                  TRIAL UTILIZADO
                </span>
              )}

              <div className="text-center space-y-4 pt-2">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>

                <div>
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.free ? (
                    <span className="text-sm text-gray-400">/7 dias</span>
                  ) : (
                    <span className="text-sm text-gray-400">/mês</span>
                  )}
                </div>

                <p className="text-xs text-gray-400">
                  {plan.free ? '50 mensagens por 7 dias' : `${plan.messages} mensagens/mês`}
                </p>

                <ul className="space-y-2.5 text-sm text-gray-500">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 justify-center">
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Botão — lógica diferente pro Free */}
                {plan.free ? (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading !== null || jaUsouTrial}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      jaUsouTrial
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20'
                    } disabled:opacity-50`}
                  >
                    {jaUsouTrial
                      ? 'Trial já utilizado'
                      : loading === plan.id
                        ? <Loader2 className="animate-spin mx-auto" size={16} />
                        : 'Começar grátis'
                    }
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading !== null}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    } disabled:opacity-50`}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="animate-spin mx-auto" size={16} />
                    ) : (
                      'Assinar agora'
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-300 mt-8">
          Pagamento processado com segurança via Asaas. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
}