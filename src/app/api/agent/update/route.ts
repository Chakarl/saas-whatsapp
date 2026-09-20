import { createServerSupabase } from '@/lib/supabase-server';
import { sanitizePromptField } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Muitas requisições' }, { status: 429 });
  }

  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await req.json();

    const nomeAgente = sanitizePromptField(body.nome_agente?.slice(0, 50));
    const nomeEmpresa = sanitizePromptField(body.nome_empresa?.slice(0, 100));
    const tom = ['formal', 'informal'].includes(body.tom) ? body.tom : 'informal';
    const regras = sanitizePromptField(body.regras_extras?.slice(0, 500));
    const saudacao = sanitizePromptField(body.saudacao_personalizada?.slice(0, 200));

    const { error } = await supabase
      .from('tenants')
      .update({
        nome_agente_personalizado: nomeAgente,
        nome_empresa: nomeEmpresa,
        tom_conversa: tom,
        regras_extras: regras,
        saudacao_personalizada: saudacao,
      })
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}