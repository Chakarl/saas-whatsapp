'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function formatCPF(value: string) {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

function formatPhone(value: string) {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 2) return `(${nums}`;
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
}

const planosNomes: Record<string, string> = {
  starter: 'Starter — R$ 97/mês',
  pro: 'Pro — R$ 197/mês',
  business: 'Business — R$ 397/mês',
  enterprise: 'Enterprise — R$ 797/mês',
};

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const planoEscolhido = searchParams.get('plano') || 'pro';
  const planoLabel = planosNomes[planoEscolhido] || planosNomes.pro;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      setErro('CPF inválido. Digite 11 números.');
      setLoading(false);
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (authError) {
      setErro(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setErro('Erro ao criar conta. Tente novamente.');
      setLoading(false);
      return;
    }

    // Criar tenant com plano pending
    const { error: tenantError } = await supabase.from('tenants').insert({
      user_id: authData.user.id,
      nome,
      email,
      telefone,
      cpf_cnpj: cpfLimpo,
      plano: planoEscolhido,
      plano_status: 'pending',
      ativo: false,
      limite_mensagens_mes: 0,
      mensagens_usadas: 0,
      nome_agente_personalizado: 'Assistente',
      nome_empresa: '',
      tom_conversa: 'informal',
      regras_extras: '',
      saudacao_personalizada: '',
    });

    if (tenantError) {
      setErro('Erro ao criar conta. Tente novamente.');
      setLoading(false);
      return;
    }

    // Criar cobrança direto no Asaas
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plano: planoEscolhido,
          billingType: 'PIX',
        }),
      });

      const data = await res.json();

      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
        return;
      }
    } catch {
      // Se falhar, redireciona pra choose-plan como fallback
    }

    router.push('/choose-plan');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-xl font-bold text-blue-600">Agente de Crédito</h1>
          <CardTitle className="text-2xl font-bold mt-2">Criar conta</CardTitle>
          <div className="mt-3 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-lg">
            Plano selecionado: {planoLabel}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone WhatsApp</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(63) 99999-9999"
                required
              />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            {erro && (
              <p className="text-sm text-red-500 text-center">{erro}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processando...' : 'Criar conta e pagar'}
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-500">
            Já tem conta?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Fazer login
            </a>
          </p>

          <p className="text-xs text-center mt-2 text-gray-400">
            <a href="/#precos" className="hover:underline">
              ← Trocar de plano
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}