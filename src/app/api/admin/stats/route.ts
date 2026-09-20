import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Verificar se é admin
    const { data: tenant } = await supabase
      .from('tenants')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!tenant?.is_admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Buscar todos os tenants
    const { data: tenants } = await supabase
      .from('tenants')
      .select('id, nome, email, telefone, plano, plano_status, ativo, mensagens_usadas, limite_mensagens_mes, created_at')
      .order('created_at', { ascending: false });

    // Buscar pagamentos recentes
    const { data: pagamentos } = await supabase
      .from('pagamentos')
      .select('id, tenant_id, valor_centavos, status, created_at, asaas_payment_id')
      .order('created_at', { ascending: false })
      .limit(50);

    // Métricas
    const totalTenants = tenants?.length || 0;
    const ativos = tenants?.filter(t => t.plano_status === 'active').length || 0;
    const trial = tenants?.filter(t => t.plano === 'trial').length || 0;
    const inadimplentes = tenants?.filter(t => t.plano_status === 'overdue').length || 0;

    const receitaMensal = tenants?.reduce((acc, t) => {
      if (t.plano_status === 'active') {
        const valores: Record<string, number> = {
          starter: 9700,
          pro: 19700,
          business: 49700,
          enterprise: 99700,
        };
        return acc + (valores[t.plano] || 0);
      }
      return acc;
    }, 0) || 0;

    const totalMensagens = tenants?.reduce((acc, t) => acc + (t.mensagens_usadas || 0), 0) || 0;

    return NextResponse.json({
      stats: {
        totalTenants,
        ativos,
        trial,
        inadimplentes,
        receitaMensal,
        totalMensagens,
      },
      tenants,
      pagamentos,
    });
  } catch (err) {
    console.error('Erro admin stats:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}