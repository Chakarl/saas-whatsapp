import { createServerSupabase } from '@/lib/supabase-server';
import { disconnectInstance } from '@/lib/evolution';
import { rateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: 'Muitas tentativas' }, { status: 429 });
  }

  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, instance_name')
      .eq('user_id', user.id)
      .single();

    if (!tenant || !tenant.instance_name) {
      return NextResponse.json({ error: 'Nenhuma instância conectada' }, { status: 400 });
    }

    await disconnectInstance(tenant.instance_name);

    await supabase
      .from('tenants')
      .update({
        instance_status: 'disconnected',
        instance_name: null,
      })
      .eq('id', tenant.id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}