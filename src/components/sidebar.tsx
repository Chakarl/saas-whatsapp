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
  LogOut
} from 'lucide-react';

interface SidebarProps {
  tenant: {
    nome: string;
    nome_empresa: string;
  };
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { href: '/dashboard/agent', label: 'Agente', icon: Bot },
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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          {tenant.nome_empresa || 'Meu SaaS'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{tenant.nome}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 w-full transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}