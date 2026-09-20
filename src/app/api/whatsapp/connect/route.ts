import { createServerSupabase } from '@/lib/supabase-server';
import { createInstance, getQRCode } from '@/lib/evolution';
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
      .select('id, instance_name, instance_status')
      .eq('user_id', user.id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
    }

    if (tenant.instance_status === 'connected' && tenant.instance_name) {
      return NextResponse.json({ error: 'WhatsApp já está conectado' }, { status: 400 });
    }

    const instanceName = tenant.instance_name || `tenant-${tenant.id.slice(0, 8)}`;
    const webhookUrl = process.env.WEBHOOK_N8N_URL || '';

    // Se já tem instância, só busca QR code novo
    if (tenant.instance_name) {
      const qrData = await getQRCode(tenant.instance_name);

      if (qrData.base64) {
        await supabase
          .from('tenants')
          .update({ instance_status: 'connecting' })
          .eq('id', tenant.id);

        return NextResponse.json({
          qrcode: qrData.base64,
          instanceName: tenant.instance_name,
        });
      }
    }

    // Criar nova instância
    const result = await createInstance(instanceName, webhookUrl);

    if (result.error) {
      console.error('Erro Evolution create:', result);
      return NextResponse.json({ error: 'Erro ao criar instância' }, { status: 500 });
    }

    // Salvar no tenant
    await supabase
      .from('tenants')
      .update({
        instance_name: instanceName,
        instance_status: 'connecting',
      })
      .eq('id', tenant.id);

    // Buscar QR code
    const qrData = await getQRCode(instanceName);

    return NextResponse.json({
      qrcode: qrData.base64 || null,
      instanceName,
    });
  } catch (err) {
    console.error('Erro whatsapp/connect:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}