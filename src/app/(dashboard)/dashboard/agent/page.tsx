'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Loader2, Check, Bot } from 'lucide-react';

export default function AgentPage() {
  const [nomeAgente, setNomeAgente] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [tom, setTom] = useState('informal');
  const [regras, setRegras] = useState('');
  const [saudacao, setSaudacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadAgent();
  }, []);

  async function loadAgent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: tenant } = await supabase
      .from('tenants')
      .select('nome_agente_personalizado, nome_empresa, tom_conversa, regras_extras, saudacao_personalizada')
      .eq('user_id', user.id)
      .single();

    if (tenant) {
      setNomeAgente(tenant.nome_agente_personalizado || '');
      setNomeEmpresa(tenant.nome_empresa || '');
      setTom(tenant.tom_conversa || 'informal');
      setRegras(tenant.regras_extras || '');
      setSaudacao(tenant.saudacao_personalizada || '');
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const res = await fetch('/api/agent/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome_agente: nomeAgente,
        nome_empresa: nomeEmpresa,
        tom,
        regras_extras: regras,
        saudacao_personalizada: saudacao,
      }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setLoading(false);
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personalizar Agente</h1>
        <p className="text-sm text-gray-400 mt-1">Defina como seu agente se comporta</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg">
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Bot size={18} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Configurações do agente</p>
            <p className="text-xs text-gray-400">Personalize nome, tom e regras</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-5">
          <div>
            <label className={labelClass}>Nome do agente</label>
            <input
              value={nomeAgente}
              onChange={(e) => setNomeAgente(e.target.value)}
              placeholder="Ex: Maria, Carlos, Assistente"
              maxLength={50}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Nome da empresa</label>
            <input
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              placeholder="Ex: Loja do João, Banco BB"
              maxLength={100}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tom de conversa</label>
            <div className="flex gap-3 mt-1">
              {['informal', 'formal'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTom(opt)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                    tom === opt
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {opt === 'informal' ? '😊 Informal' : '👔 Formal'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Regras extras (opcional)</label>
            <textarea
              value={regras}
              onChange={(e) => setRegras(e.target.value)}
              placeholder="Ex: Não falar de concorrentes, sempre oferecer garantia estendida..."
              maxLength={500}
              rows={3}
              className={`${inputClass} resize-none`}
            />
            <p className="text-[11px] text-gray-300 mt-1 text-right">{regras.length}/500</p>
          </div>

          <div>
            <label className={labelClass}>Saudação personalizada (opcional)</label>
            <input
              value={saudacao}
              onChange={(e) => setSaudacao(e.target.value)}
              placeholder="Ex: Bem-vindo à nossa loja!"
              maxLength={200}
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
            {saved ? 'Salvo com sucesso!' : loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}