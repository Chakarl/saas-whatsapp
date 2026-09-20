import { createServerSupabase } from '@/lib/supabase-server';
import { getStatus } from '@/lib/evolution';
import { rateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(ip, 60, 60000)) {
    return NextResponse.json({ error: 'Muitas requisições' }, { status: 429 });
  }

  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const instanceName = searchParams.get('instance');

    if (!instanceName) {
      return NextResponse.json({ error: 'Instância não informada' }, { status: 400 });
    }

    const { data: tenant } = await supabase
      .from('tenants')
      .select('instance_name')
      .eq('user_id', user.id)
      .single();

    if (!tenant || tenant.instance_name !== instanceName) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const statusData = await getStatus(instanceName);

    return NextResponse.json({
      state: statusData.state,
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}