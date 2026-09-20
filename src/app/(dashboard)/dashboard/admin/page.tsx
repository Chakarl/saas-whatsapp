'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Tenant {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  plano: string;
  plano_status: string;
  ativo: boolean;
  mensagens_usadas: number;
  limite_mensagens_mes: number;
  created_at: string;
}

interface Pagamento {
  id: string;
  tenant_id: string;
  valor_centavos: number;
  status: string;
  created_at: string;
  asaas_payment_id: string;
}

interface Stats {
  totalTenants: number;
  ativos: number;
  trial: number;
  inadimplentes: number;
  receitaMensal: number;
  totalMensagens: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();

    if (data.error) {
      setErro(data.error);
      setLoading(false);
      return;
    }

    setStats(data.stats);
    setTenants(data.tenants || []);
    setPagamentos(data.pagamentos || []);
    setLoading(false);
  }

  function formatCurrency(centavos: number) {
    return (centavos / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  function statusBadge(status: string) {
    const map: Record<string, { label: string; className: string }> = {
      active: { label: 'Ativo', className: 'bg-green-100 text-green-700' },
      trial: { label: 'Trial', className: 'bg-blue-100 text-blue-700' },
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' },
      overdue: { label: 'Inadimplente', className: 'bg-red-100 text-red-700' },
      cancelled: { label: 'Cancelado', className: 'bg-gray-100 text-gray-700' },
      paid: { label: 'Pago', className: 'bg-green-100 text-green-700' },
    };

    const s = map[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.className}`}>
        {s.label}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 font-medium">{erro}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Painel Administrativo</h1>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.totalTenants}</p>
                <p className="text-xs text-gray-500">Total clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.ativos}</p>
                <p className="text-xs text-gray-500">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats?.trial}</p>
                <p className="text-xs text-gray-500">Trial</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats?.inadimplentes}</p>
                <p className="text-xs text-gray-500">Inadimplentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats?.receitaMensal || 0)}</p>
                <p className="text-xs text-gray-500">MRR</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.totalMensagens?.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-500">Msgs este mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de clientes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Nome</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Plano</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Mensagens</th>
                  <th className="pb-3 font-medium">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{t.nome}</td>
                    <td className="py-3 text-gray-500">{t.email}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="capitalize">
                        {t.plano}
                      </Badge>
                    </td>
                    <td className="py-3">{statusBadge(t.plano_status)}</td>
                    <td className="py-3">
                      {t.mensagens_usadas}/{t.limite_mensagens_mes === 99999 ? '∞' : t.limite_mensagens_mes}
                    </td>
                    <td className="py-3 text-gray-500">{formatDate(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Valor</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">ID Asaas</th>
                  <th className="pb-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map((p) => {
                  const t = tenants.find((tenant) => tenant.id === p.tenant_id);
                  return (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{t?.nome || '—'}</td>
                      <td className="py-3">{formatCurrency(p.valor_centavos)}</td>
                      <td className="py-3">{statusBadge(p.status)}</td>
                      <td className="py-3 text-gray-400 text-xs">{p.asaas_payment_id}</td>
                      <td className="py-3 text-gray-500">{formatDate(p.created_at)}</td>
                    </tr>
                  );
                })}
                {pagamentos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">
                      Nenhum pagamento registrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}