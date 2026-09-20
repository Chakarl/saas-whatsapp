'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Loader2, Sparkles } from 'lucide-react';

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

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
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

    if (authData.user) {
      const { error: tenantError } = await supabase.from('tenants').insert({
        user_id: authData.user.id,
        nome,
        email,
        telefone,
        cpf_cnpj: cpfLimpo,
        plano: 'free',
        plano_status: 'active',
        ativo: true,
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

      try {
        await fetch('/api/email/welcome', { method: 'POST' });
      } catch {
        // Não bloqueia
      }
    }

    router.push('/dashboard');
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 mb-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Agente de Crédito</h1>
          <p className="text-sm text-gray-400 mt-1">Crie sua conta</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className={labelClass}>Nome completo</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>CPF</label>
              <input
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                required
                className={inputClass}
              />
            </div>

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
              <label className={labelClass}>Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(63) 99999-9999"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
                className={inputClass}
              />
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
              {loading ? 'Criando conta...' : 'Criar conta e pagar'}
            </button>
          </form>
        </div>

        <p className="text-sm text-center mt-6 text-gray-400">
          Já tem conta?{' '}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Fazer login
          </a>
        </p>
      </div>
    </div>
  );
}