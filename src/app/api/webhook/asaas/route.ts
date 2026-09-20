import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { sendPaymentConfirmedEmail, sendPaymentOverdueEmail } from '@/lib/email';

const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN;

const limitesPorPlano: Record<string, number> = {
  starter: 500,
  pro: 2000,
  business: 5000,
  enterprise: 999999,
};

export async function POST(req: Request) {
  try {
    const token = req.headers.get('asaas-access-token');
    if (WEBHOOK_TOKEN && token !== WEBHOOK_TOKEN) {
      console.warn('Webhook Asaas: token inválido');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const event = body.event;
    const payment = body.payment;

    console.log('Webhook Asaas recebido:', event, payment?.id);

    if (!payment) {
      return NextResponse.json({ ok: true });
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {},
        },
      }
    );

    const customerId = payment.customer;

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, plano, nome, email')
      .eq('asaas_customer_id', customerId)
      .single();

    if (!tenant) {
      console.error('Webhook: tenant não encontrado para customer:', customerId);
      return NextResponse.json({ ok: true });
    }

    // Pagamento confirmado
    if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
      const limite = limitesPorPlano[tenant.plano] || 500;

      await supabase
        .from('tenants')
        .update({
          plano_status: 'active',
          ativo: true,
          limite_mensagens_mes: limite,
          mensagens_usadas: 0,
        })
        .eq('id', tenant.id);

      await supabase
        .from('pagamentos')
        .update({ status: 'paid' })
        .eq('asaas_payment_id', payment.id);

      await sendPaymentConfirmedEmail(tenant.email, tenant.nome, tenant.plano);

      console.log(`✅ Pagamento confirmado - Tenant: ${tenant.id} - Plano: ${tenant.plano} - Limite: ${limite}`);
    }

    // Pagamento vencido
    if (event === 'PAYMENT_OVERDUE') {
      await supabase
        .from('tenants')
        .update({ plano_status: 'overdue' })
        .eq('id', tenant.id);

      await supabase
        .from('pagamentos')
        .update({ status: 'overdue' })
        .eq('asaas_payment_id', payment.id);

      await sendPaymentOverdueEmail(tenant.email, tenant.nome);

      console.log(`⚠️ Pagamento vencido - Tenant: ${tenant.id}`);
    }

    // Pagamento cancelado / reembolsado
    if (event === 'PAYMENT_REFUNDED' || event === 'PAYMENT_DELETED') {
      await supabase
        .from('tenants')
        .update({
          plano_status: 'cancelled',
          ativo: false,
          limite_mensagens_mes: 0,
        })
        .eq('id', tenant.id);

      await supabase
        .from('pagamentos')
        .update({ status: 'cancelled' })
        .eq('asaas_payment_id', payment.id);

      console.log(`❌ Pagamento cancelado - Tenant: ${tenant.id}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Erro webhook Asaas:', err);
    return NextResponse.json({ ok: true });
  }
}