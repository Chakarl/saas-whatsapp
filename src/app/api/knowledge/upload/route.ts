import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 200;

function splitText(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 50) {
      chunks.push(chunk);
    }
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

async function getEmbedding(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0].embedding;
}

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

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const textContent = formData.get('text') as string | null;
    const source = formData.get('source') as string || 'manual';

    let fullText = '';

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.name.endsWith('.pdf')) {
        const pdf = await pdfParse(buffer);
        fullText = pdf.text;
      } else {
        fullText = buffer.toString('utf-8');
      }
    } else if (textContent) {
      fullText = textContent;
    } else {
      return NextResponse.json({ error: 'Envie um arquivo ou texto' }, { status: 400 });
    }

    if (fullText.trim().length < 50) {
      return NextResponse.json({ error: 'Conteúdo muito curto (mínimo 50 caracteres)' }, { status: 400 });
    }

    // Dividir em chunks
    const chunks = splitText(fullText);

    // Gerar embeddings e salvar
    let saved = 0;

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);

      const { error } = await supabase.from('documents').insert({
        content: chunk,
        embedding,
        metadata: {
          tenant_id: tenant.id,
          source,
          file_name: file?.name || 'texto_manual',
          uploaded_at: new Date().toISOString(),
        },
      });

      if (!error) saved++;
    }

    return NextResponse.json({
      ok: true,
      chunks_total: chunks.length,
      chunks_saved: saved,
    });
  } catch (err) {
    console.error('Erro knowledge upload:', err);
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 });
  }
}