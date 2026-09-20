import { createServerSupabase } from '@/lib/supabase-server';
import { sendWelcomeEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { data: tenant } = await supabase
      .from('tenants')
      .select('nome, email')
      .eq('user_id', user.id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
    }

    await sendWelcomeEmail(tenant.email, tenant.nome);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Erro email welcome:', err);
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
  }
}