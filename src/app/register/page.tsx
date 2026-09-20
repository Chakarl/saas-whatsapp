'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Loader2, Sparkles, Eye, EyeOff, Check, X } from 'lucide-react';

function formatCPF(value: string) {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

function formatPhone(value: string) {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 2) return nums.length ? `(${nums}` : '';
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
}

function getPasswordChecks(senha: string) {
  return [
    { label: 'Mínimo 8 caracteres', ok: senha.length >= 8 },
    { label: 'Letra maiúscula', ok: /[A-Z]/.test(senha) },
    { label: 'Letra minúscula', ok: /[a-z]/.test(senha) },
    { label: 'Número', ok: /[0-9]/.test(senha) },
    { label: 'Caractere especial (!@#$...)', ok: /[^A-Za-z0-9]/.test(senha) },
  ];
}

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const passwordChecks = getPasswordChecks(senha);
  const allChecksPass = passwordChecks.every((c) => c.ok);
  const senhasConferem = senha === confirmarSenha && confirmarSenha.length > 0;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const cpfLimpo = cpf.replace(/\D/g, '');
    const telLimpo = telefone.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      setErro('CPF deve ter 11 dígitos');
      setLoading(false);
      return;
    }

    if (!allChecksPass) {
      setErro('A senha não atende todos os requisitos');
      setLoading(false);
      return;
    }

    if (!senhasConferem) {
      setErro('As senhas não conferem');
      setLoading(false);
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (authError || !authData.user) {
      setErro(authError?.message || 'Erro ao criar conta');
      setLoading(false);
      return;
    }

    const { error: tenantError } = await supabase.from('tenants').insert({
      user_id: authData.user.id,
      nome,
      email,
      cpf_cnpj: cpfLimpo,
      telefone: telLimpo,
      plano: 'pending',
      plano_status: 'pending',
      ativo: false,
      mensagens_usadas: 0,
      limite_mensagens_mes: 0,
    });

    if (tenantError) {
      setErro('Erro ao salvar dados. Tente novamente.');
      setLoading(false);
      return;
    }

    router.push('/choose-plan');
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
            {/* Nome */}
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

            {/* Email */}
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

            {/* CPF */}
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

            {/* Telefone */}
            <div>
              <label className={labelClass}>Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                required
                className={inputClass}
              />
            </div>

            {/* Senha */}
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

              {/* Validação visual */}
              {senha.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2">
                      {check.ok ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <X size={14} className="text-gray-300" />
                      )}
                      <span className={`text-xs ${check.ok ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmar senha */}
            <div>
              <label className={labelClass}>Confirmar senha</label>
              <div className="relative">
                <input
                  type={showConfirmar ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`${inputClass} pr-12 ${
                    confirmarSenha.length > 0
                      ? senhasConferem
                        ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20'
                        : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmarSenha.length > 0 && !senhasConferem && (
                <p className="text-xs text-red-500 mt-1.5">As senhas não conferem</p>
              )}
              {senhasConferem && (
                <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                  <Check size={12} /> Senhas conferem
                </p>
              )}
            </div>

            {/* Erro */}
            {erro && (
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-sm text-red-600 text-center font-medium">{erro}</p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading || !allChecksPass || !senhasConferem}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-sm text-center mt-6 text-gray-400">
          Já tem conta?{' '}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}