'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Loader2, Check, Settings } from 'lucide-react';

export default function SettingsPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: tenant } = await supabase
      .from('tenants')
      .select('nome, email, telefone, cpf_cnpj')
      .eq('user_id', user.id)
      .single();

    if (tenant) {
      setNome(tenant.nome || '');
      setEmail(tenant.email || '');
      setTelefone(tenant.telefone || '');
      setCpfCnpj(tenant.cpf_cnpj || '');
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('tenants')
      .update({ nome, telefone, cpf_cnpj: cpfCnpj })
      .eq('user_id', user.id);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setLoading(false);
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-400 mt-1">Gerencie os dados da sua conta</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg">
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Settings size={18} className="text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Dados da conta</p>
            <p className="text-xs text-gray-400">Informações pessoais e de cobrança</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-5">
          <div>
            <label className={labelClass}>Nome completo</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              value={email}
              disabled
              className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
            />
            <p className="text-[11px] text-gray-300 mt-1">Email não pode ser alterado</p>
          </div>

          <div>
            <label className={labelClass}>CPF ou CNPJ</label>
            <input
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              placeholder="000.000.000-00"
              className={inputClass}
            />
            <p className="text-[11px] text-gray-300 mt-1">Necessário para emissão de cobranças</p>
          </div>

          <div>
            <label className={labelClass}>Telefone</label>
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(63) 99999-9999"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : saved ? (
              <Check size={16} />
            ) : null}
            {saved ? 'Salvo com sucesso!' : loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
}