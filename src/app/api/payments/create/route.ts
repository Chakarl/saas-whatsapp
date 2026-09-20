import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

const ASAAS_URL = process.env.ASAAS_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_KEY = process.env.ASAAS_API_KEY!;

export async function POST(req: Request) {
  try {
    console.log('=== PAYMENTS/CREATE INICIO ===');
    console.log('ASAAS_URL:', ASAAS_URL);
    console.log('ASAAS_KEY existe:', !!ASAAS_KEY, 'Primeiros chars:', ASAAS_KEY?.slice(0, 15));

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('ERRO: Usuário não autenticado');
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    console.log('User ID:', user.id);

    const { data: tenant, error: tenantErr } = await supabase
      .from('tenants')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!tenant) {
      console.log('ERRO: Tenant não encontrado', tenantErr);
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
    }

    console.log('Tenant:', tenant.id, tenant.nome, tenant.cpf_cnpj, tenant.email);

    const body = await req.json();
    const { plano, billingType } = body;

    const precos: Record<string, number> = {
      starter: 97,
      pro: 197,
      business: 397,
      enterprise: 797,
    };

    const valor = precos[plano];
    if (!valor) {
      console.log('ERRO: Plano inválido:', plano);
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // Criar ou buscar customer no Asaas
    let customerId = tenant.asaas_customer_id;

    if (!customerId) {
      const customerPayload = {
        name: tenant.nome,
        email: tenant.email,
        cpfCnpj: tenant.cpf_cnpj,
        phone: tenant.telefone?.replace(/\D/g, '') || '',
      };

      console.log('Criando customer Asaas:', JSON.stringify(customerPayload));

      const customerRes = await fetch(`${ASAAS_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_KEY,
        },
        body: JSON.stringify(customerPayload),
      });

      const customerData = await customerRes.json();
      console.log('Resposta Asaas customer:', JSON.stringify(customerData));

      if (customerData.id) {
        customerId = customerData.id;
        await supabase
          .from('tenants')
          .update({ asaas_customer_id: customerId })
          .eq('id', tenant.id);
      } else {
        console.error('ERRO Asaas customer:', JSON.stringify(customerData));
        return NextResponse.json(
          { error: 'Erro ao criar cliente no Asaas', details: customerData },
          { status: 500 }
        );
      }
    }

    console.log('Customer ID:', customerId);

    // Criar cobrança
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const paymentPayload = {
      customer: customerId,
      billingType: billingType || 'PIX',
      value: valor,
      dueDate: dueDate.toISOString().split('T')[0],
      description: `Agente de Crédito - Plano ${plano}`,
      externalReference: JSON.stringify({
        tenant_id: tenant.id,
        plano,
      }),
    };

    console.log('Criando payment Asaas:', JSON.stringify(paymentPayload));

    const paymentRes = await fetch(`${ASAAS_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_KEY,
      },
      body: JSON.stringify(paymentPayload),
    });

    const paymentData = await paymentRes.json();
    console.log('Resposta Asaas payment:', JSON.stringify(paymentData));

    if (!paymentData.id) {
      console.error('ERRO Asaas cobrança:', JSON.stringify(paymentData));
      return NextResponse.json(
        { error: 'Erro ao criar cobrança', details: paymentData },
        { status: 500 }
      );
    }

    // Salvar pagamento
    await supabase.from('pagamentos').insert({
      tenant_id: tenant.id,
      asaas_payment_id: paymentData.id,
      valor_centavos: valor * 100,
      status: 'pending',
      plano,
    });

    await supabase
      .from('tenants')
      .update({ plano })
      .eq('id', tenant.id);

    console.log('=== PAYMENTS/CREATE SUCESSO ===', paymentData.invoiceUrl);

    return NextResponse.json({
      ok: true,
      invoiceUrl: paymentData.invoiceUrl,
      paymentId: paymentData.id,
    });
  } catch (err) {
    console.error('ERRO FATAL payments/create:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}