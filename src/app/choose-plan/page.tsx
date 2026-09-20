'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'R$ 97',
    messages: '500',
    limit: 500,
    features: ['1 agente IA', '500 mensagens/mês', 'Suporte por WhatsApp'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 197',
    messages: '2.000',
    limit: 2000,
    popular: true,
    features: ['1 agente IA', '2.000 mensagens/mês', 'Suporte prioritário'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 'R$ 397',
    messages: '5.000',
    limit: 5000,
    features: ['1 agente IA', '5.000 mensagens/mês', 'Suporte dedicado'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'R$ 797',
    messages: 'Ilimitadas',
    limit: 999999,
    features: ['1 agente IA', 'Mensagens ilimitadas', 'Suporte VIP'],
  },
];

export default function ChoosePlanPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [tenant, setTenant] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadTenant();
  }, []);

  async function loadTenant() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data } = await supabase
      .from('tenants')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!data) {
      router.push('/register');
      return;
    }

    if (data.plano_status === 'active' && data.plano !== 'pending') {
      router.push('/dashboard');
      return;
    }

    setTenant(data);
  }

  async function handleSubscribe(plan: typeof plans[0]) {
    setLoading(plan.id);

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plano: plan.id,
          billingType: paymentMethod,
        }),
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Escolha seu plano</h1>
          <p className="text-gray-500 mt-2">
            Olá, {tenant.nome}! Escolha um plano para ativar seu Agente de Crédito.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setPaymentMethod('PIX')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              paymentMethod === 'PIX'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            PIX
          </button>
          <button
            onClick={() => setPaymentMethod('CREDIT_CARD')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              paymentMethod === 'CREDIT_CARD'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            Cartão de Crédito
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? 'border-blue-600 border-2 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MAIS POPULAR
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/mês</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{plan.messages} mensagens/mês</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading !== null}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Processando...
                    </>
                  ) : (
                    'Assinar agora'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Pagamento processado com segurança via Asaas. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
}