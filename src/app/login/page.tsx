'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 mb-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Agente de Crédito</h1>
          <p className="text-sm text-gray-400 mt-1">Entre na sua conta</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Senha</label>
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-sm text-red-600 text-center font-medium">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-sm text-center mt-6 text-gray-400">
          Não tem conta?{' '}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Criar conta
          </a>
        </p>
      </div>
    </div>
  );
}