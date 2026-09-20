'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, CreditCard, QrCode } from 'lucide-react';

interface Plano {
  id: string;
  nome: string;
  mensagens_mes: number;
  preco_centavos: number;
  ativo: boolean;
}

export default function PlanPage() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [planoAtual, setPlanoAtual] = useState<string>('');
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
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

    if (tenant) {
      setPlanoAtual(tenant.plano);
    }

    const { data: planosData } = await supabase
      .from('planos')
      .select('*')
      .eq('ativo', true)
      .order('preco_centavos', { ascending: true });

    if (planosData) {
      setPlanos(planosData);
    }
  }

  async function handleSelectPlan(plano: Plano) {
    setLoading(plano.id);

    try {
      const res = await fetch('/api/plan/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plano_id: plano.id,
          billing_type: selectedPayment,
        }),
      });

      const data = await res.json();
      console.log('Resposta checkout:', data);

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (data.ok) {
        alert('Cobrança criada! Verifique seu email para pagamento.');
        setPlanoAtual(plano.nome.toLowerCase());
      } else {
        alert(data.error || 'Erro ao processar. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao processar. Tente novamente.');
    }

    setLoading(null);
  }

  function formatPrice(centavos: number) {
    return (centavos / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Escolha seu plano</h1>

      {/* Seletor de forma de pagamento */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setSelectedPayment('PIX')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
            selectedPayment === 'PIX'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
          }`}
        >
          <QrCode size={20} />
          <div className="text-left">
            <p className="font-semibold text-sm">PIX</p>
            <p className="text-xs opacity-70">Aprovação instantânea</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedPayment('CREDIT_CARD')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
            selectedPayment === 'CREDIT_CARD'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
          }`}
        >
          <CreditCard size={20} />
          <div className="text-left">
            <p className="font-semibold text-sm">Cartão de Crédito</p>
            <p className="text-xs opacity-70">Recorrência automática</p>
          </div>
        </button>
      </div>

      {/* Cards dos planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {planos.map((plano) => {
          const isAtual = planoAtual === plano.nome.toLowerCase();

          return (
            <Card
              key={plano.id}
              className={`relative overflow-visible ${
                isAtual ? 'border-blue-500 border-2' : ''
              }`}
            >
              {isAtual && (
                <Badge className="absolute -top-3 left-4 bg-blue-600">
                  Plano atual
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle>{plano.nome}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-3xl font-bold">
                  {formatPrice(plano.preco_centavos)}
                  <span className="text-sm font-normal text-gray-500">/mês</span>
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2 justify-center">
                    <Check size={14} className="text-green-500" />
                    {plano.mensagens_mes === 99999
                      ? 'Mensagens ilimitadas'
                      : `${plano.mensagens_mes.toLocaleString('pt-BR')} mensagens/mês`}
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Check size={14} className="text-green-500" />
                    Agente personalizado
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Check size={14} className="text-green-500" />
                    WhatsApp conectado 24h
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Check size={14} className="text-green-500" />
                    Suporte por WhatsApp
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant={isAtual ? 'outline' : 'default'}
                  disabled={isAtual || loading === plano.id}
                  onClick={() => handleSelectPlan(plano)}
                >
                  {loading === plano.id ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : null}
                  {isAtual ? 'Plano atual' : 'Assinar'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}