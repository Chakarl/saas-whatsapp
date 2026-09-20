'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  Database,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  tenant: {
    nome: string;
    nome_empresa: string;
    is_admin?: boolean;
  };
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { href: '/dashboard/agent', label: 'Agente', icon: Bot },
  { href: '/dashboard/knowledge', label: 'Conhecimento', icon: Database },
  { href: '/dashboard/usage', label: 'Uso', icon: BarChart3 },
  { href: '/dashboard/plan', label: 'Plano', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ tenant }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">
              {tenant.nome_empresa || 'Agente de Crédito'}
            </h1>
            <p className="text-xs text-gray-400 leading-tight mt-0.5">{tenant.nome}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm shadow-blue-500/5'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}

        {/* Admin */}
        {tenant.is_admin && (
          <>
            <div className="border-t border-gray-100 my-3 mx-3" />
            <p className="px-3 text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-1">Admin</p>
            <Link
              href="/dashboard/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                pathname === '/dashboard/admin'
                  ? 'bg-red-50 text-red-600'
                  : 'text-red-400 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <ShieldCheck size={18} />
              Painel Admin
            </Link>
            <Link
              href="/dashboard/admin/knowledge"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                pathname === '/dashboard/admin/knowledge'
                  ? 'bg-red-50 text-red-600'
                  : 'text-red-400 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <Database size={18} />
              Base de Conhecimento
            </Link>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-200/60">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 w-full transition-all duration-200"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}