'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check } from 'lucide-react';

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h1>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Dados da conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email não pode ser alterado
              </p>
            </div>

            <div>
              <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
              <Input
                id="cpfCnpj"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                placeholder="000.000.000-00"
              />
              <p className="text-xs text-gray-400 mt-1">
                Necessário para emissão de cobranças
              </p>
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(63) 99999-9999"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : saved ? (
                <Check className="mr-2" size={16} />
              ) : null}
              {saved ? 'Salvo!' : loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}