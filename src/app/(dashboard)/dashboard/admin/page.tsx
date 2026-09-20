'use client';

import { useState, useEffect } from 'react';
import {
  Users, DollarSign, MessageSquare, AlertTriangle, CheckCircle, Clock,
  Loader2, ShieldCheck,
} from 'lucide-react';

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
    return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function statusBadge(status: string) {
    const map: Record<string, { label: string; dot: string; bg: string; text: string }> = {
      active:    { label: 'Ativo',        dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
      trial:     { label: 'Trial',        dot: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700' },
      pending:   { label: 'Pendente',     dot: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700' },
      overdue:   { label: 'Inadimplente', dot: 'bg-red-500',     bg: 'bg-red-50',     text: 'text-red-700' },
      cancelled: { label: 'Cancelado',    dot: 'bg-gray-400',    bg: 'bg-gray-100',   text: 'text-gray-600' },
      paid:      { label: 'Pago',         dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    };
    const s = map[status] || { label: status, dot: 'bg-gray-400', bg: 'bg-gray-100', text: 'text-gray-600' };

    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {s.label}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gray-300" size={28} />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 max-w-md">
        <p className="text-sm text-red-600 font-medium">{erro}</p>
      </div>
    );
  }

  const metricCards = [
    { label: 'Total clientes', value: stats?.totalTenants, icon: Users, color: 'blue' },
    { label: 'Ativos',         value: stats?.ativos,       icon: CheckCircle, color: 'emerald' },
    { label: 'Trial',          value: stats?.trial,        icon: Clock, color: 'indigo' },
    { label: 'Inadimplentes',  value: stats?.inadimplentes, icon: AlertTriangle, color: 'red' },
    { label: 'MRR',            value: formatCurrency(stats?.receitaMensal || 0), icon: DollarSign, color: 'emerald' },
    { label: 'Msgs este mês',  value: stats?.totalMensagens?.toLocaleString('pt-BR'), icon: MessageSquare, color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-500',
    emerald: 'bg-emerald-50 text-emerald-500',
    indigo: 'bg-indigo-50 text-indigo-500',
    red: 'bg-red-50 text-red-500',
    purple: 'bg-purple-50 text-purple-500',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <ShieldCheck size={18} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
          <p className="text-sm text-gray-400">Visão geral da plataforma</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{m.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorMap[m.color]}`}>
                  <Icon size={15} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{m.value ?? '—'}</p>
            </div>
          );
        })}
      </div>

      {/* Clientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <Users size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Clientes</h2>
          <span className="ml-auto text-xs text-gray-400">{tenants.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Plano</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Mensagens</th>
                <th className="px-6 py-3">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-gray-900">{t.nome}</td>
                  <td className="px-6 py-3.5 text-gray-500">{t.email}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                      {t.plano}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">{statusBadge(t.plano_status)}</td>
                  <td className="px-6 py-3.5 text-gray-500">
                    {t.mensagens_usadas}/{t.limite_mensagens_mes === 99999 ? '∞' : t.limite_mensagens_mes}
                  </td>
                  <td className="px-6 py-3.5 text-gray-400">{formatDate(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagamentos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <DollarSign size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Últimos pagamentos</h2>
          <span className="ml-auto text-xs text-gray-400">{pagamentos.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">ID Asaas</th>
                <th className="px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-300 text-sm">
                    Nenhum pagamento registrado
                  </td>
                </tr>
              ) : (
                pagamentos.map((p) => {
                  const t = tenants.find((tenant) => tenant.id === p.tenant_id);
                  return (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-gray-900">{t?.nome || '—'}</td>
                      <td className="px-6 py-3.5 text-gray-700 font-medium">{formatCurrency(p.valor_centavos)}</td>
                      <td className="px-6 py-3.5">{statusBadge(p.status)}</td>
                      <td className="px-6 py-3.5 text-gray-400 text-xs font-mono">{p.asaas_payment_id}</td>
                      <td className="px-6 py-3.5 text-gray-400">{formatDate(p.created_at)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}