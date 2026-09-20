import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const ids: number[] = body.ids;

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'IDs não informados' }, { status: 400 });
    }

    // Verificar que os docs pertencem ao tenant
    const { data: docs } = await supabase
      .from('documents')
      .select('id, metadata')
      .in('id', ids);

    const validIds = docs
      ?.filter((d) => (d.metadata as any)?.tenant_id === tenant.id)
      .map((d) => d.id) || [];

    if (validIds.length > 0) {
      await supabase.from('documents').delete().in('id', validIds);
    }

    return NextResponse.json({ ok: true, deleted: validIds.length });
  } catch (err) {
    console.error('Erro knowledge delete:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}