'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check } from 'lucide-react';

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Personalizar Agente
      </h1>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Configurações do agente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="nomeAgente">Nome do agente</Label>
              <Input
                id="nomeAgente"
                value={nomeAgente}
                onChange={(e) => setNomeAgente(e.target.value)}
                placeholder="Ex: Maria, Carlos, Assistente"
                maxLength={50}
              />
            </div>

            <div>
              <Label htmlFor="nomeEmpresa">Nome da empresa</Label>
              <Input
                id="nomeEmpresa"
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                placeholder="Ex: Loja do João, Banco BB"
                maxLength={100}
              />
            </div>

            <div>
              <Label>Tom de conversa</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tom"
                    value="informal"
                    checked={tom === 'informal'}
                    onChange={(e) => setTom(e.target.value)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">Informal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tom"
                    value="formal"
                    checked={tom === 'formal'}
                    onChange={(e) => setTom(e.target.value)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">Formal</span>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="regras">Regras extras (opcional)</Label>
              <Textarea
                id="regras"
                value={regras}
                onChange={(e) => setRegras(e.target.value)}
                placeholder="Ex: Não falar de concorrentes, sempre oferecer garantia estendida..."
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-gray-400 mt-1">
                {regras.length}/500 caracteres
              </p>
            </div>

            <div>
              <Label htmlFor="saudacao">Saudação personalizada (opcional)</Label>
              <Input
                id="saudacao"
                value={saudacao}
                onChange={(e) => setSaudacao(e.target.value)}
                placeholder="Ex: Bem-vindo à nossa loja!"
                maxLength={200}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : saved ? (
                <Check className="mr-2" size={16} />
              ) : null}
              {saved ? 'Salvo!' : loading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}