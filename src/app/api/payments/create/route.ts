import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

const ASAAS_URL = process.env.ASAAS_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_KEY = process.env.ASAAS_API_KEY!;

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { data: tenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
    }

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
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // Criar ou buscar customer no Asaas
    let customerId = tenant.asaas_customer_id;

    if (!customerId) {
      const customerRes = await fetch(`${ASAAS_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_KEY,
        },
        body: JSON.stringify({
          name: tenant.nome,
          email: tenant.email,
          cpfCnpj: tenant.cpf_cnpj,
          phone: tenant.telefone,
        }),
      });

      const customerData = await customerRes.json();

      if (customerData.id) {
        customerId = customerData.id;
        await supabase
          .from('tenants')
          .update({ asaas_customer_id: customerId })
          .eq('id', tenant.id);
      } else {
        return NextResponse.json({ error: 'Erro ao criar cliente no Asaas' }, { status: 500 });
      }
    }

    // Criar cobrança
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const paymentRes = await fetch(`${ASAAS_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_KEY,
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: billingType || 'PIX',
        value: valor,
        dueDate: dueDate.toISOString().split('T')[0],
        description: `Agente de Crédito - Plano ${plano}`,
        externalReference: JSON.stringify({
          tenant_id: tenant.id,
          plano,
        }),
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentData.id) {
      console.error('Erro Asaas:', paymentData);
      return NextResponse.json({ error: 'Erro ao criar cobrança' }, { status: 500 });
    }

    // Salvar pagamento no banco
    await supabase.from('pagamentos').insert({
      tenant_id: tenant.id,
      asaas_payment_id: paymentData.id,
      valor_centavos: valor * 100,
      status: 'pending',
      plano,
    });

    // Atualizar tenant com plano escolhido (ainda pending)
    await supabase
      .from('tenants')
      .update({ plano })
      .eq('id', tenant.id);

    return NextResponse.json({
      ok: true,
      invoiceUrl: paymentData.invoiceUrl,
      paymentId: paymentData.id,
    });
  } catch (err) {
    console.error('Erro payments/create:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}