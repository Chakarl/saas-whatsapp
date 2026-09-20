'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (authError) {
      setErro(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: tenantError } = await supabase.from('tenants').insert({
        user_id: authData.user.id,
        nome,
        email,
        telefone,
        plano: 'trial',
        plano_status: 'trial',
        ativo: true,
        limite_mensagens_mes: 100,
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

      // Enviar email de boas-vindas
      try {
        await fetch('/api/email/welcome', { method: 'POST' });
      } catch {
        // Não bloqueia o registro se o email falhar
      }
    }

    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
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
                onChange={(e) => setTelefone(e.target.value)}
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
              {loading ? 'Criando...' : 'Criar conta'}
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-500">
            Já tem conta?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Fazer login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}