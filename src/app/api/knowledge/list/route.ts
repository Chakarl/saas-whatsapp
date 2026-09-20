import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
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

    const { data: docs } = await supabase
      .from('documents')
      .select('id, content, metadata')
      .filter('metadata->>tenant_id', 'eq', tenant.id)
      .order('id', { ascending: false });

    // Agrupar por arquivo
    const filesMap = new Map<string, { name: string; source: string; chunks: number; date: string; ids: number[] }>();

    docs?.forEach((doc) => {
      const meta = doc.metadata as any;
      const fileName = meta?.file_name || 'desconhecido';

      if (!filesMap.has(fileName)) {
        filesMap.set(fileName, {
          name: fileName,
          source: meta?.source || 'manual',
          chunks: 0,
          date: meta?.uploaded_at || '',
          ids: [],
        });
      }

      const entry = filesMap.get(fileName)!;
      entry.chunks++;
      entry.ids.push(doc.id);
    });

    const files = Array.from(filesMap.values());

    return NextResponse.json({
      files,
      totalChunks: docs?.length || 0,
    });
  } catch (err) {
    console.error('Erro knowledge list:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}