'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro('Email ou senha incorretos');
      setLoading(false);
      return;
    }

    // Verificar se já tem plano ativo
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: tenant } = await supabase
        .from('tenants')
        .select('plano, plano_status')
        .eq('user_id', user.id)
        .single();

      if (tenant?.plano_status === 'pending' || tenant?.plano === 'pending') {
        router.push('/choose-plan');
        return;
      }
    }

    router.push('/dashboard');
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {erro && (
              <p className="text-sm text-red-500 text-center">{erro}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-500">
            Não tem conta?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Criar conta
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}