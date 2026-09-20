import { createServerSupabase } from '@/lib/supabase-server';
import { createCustomer, findCustomerByEmail, createPayment, updateCustomer } from '@/lib/asaas';
import { rateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: 'Muitas requisições' }, { status: 429 });
  }

  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const planoId = body.plano_id;
    const billingType = body.billing_type === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'PIX';

    if (!planoId) {
      return NextResponse.json({ error: 'Plano não informado' }, { status: 400 });
    }

    const { data: plano } = await supabase
      .from('planos')
      .select('*')
      .eq('id', planoId)
      .eq('ativo', true)
      .single();

    if (!plano) {
      return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 });
    }

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, nome, email, telefone, asaas_customer_id, cpf_cnpj')
      .eq('user_id', user.id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
    }

    if (!tenant.cpf_cnpj) {
      return NextResponse.json({
        error: 'Preencha seu CPF/CNPJ em Configurações antes de assinar.'
      }, { status: 400 });
    }

    // Criar ou atualizar cliente no Asaas
    let customerId = tenant.asaas_customer_id;

    if (customerId) {
      await updateCustomer(customerId, {
        name: tenant.nome,
        cpfCnpj: tenant.cpf_cnpj,
        phone: tenant.telefone,
      });
    } else {
      const existing = await findCustomerByEmail(tenant.email);

      if (existing) {
        customerId = existing.id;
        await updateCustomer(customerId, { cpfCnpj: tenant.cpf_cnpj });
      } else {
        const customer = await createCustomer({
          name: tenant.nome,
          email: tenant.email,
          phone: tenant.telefone,
          cpfCnpj: tenant.cpf_cnpj,
        });

        if (customer.errors) {
          console.error('Erro Asaas criar cliente:', customer.errors);
          return NextResponse.json({ error: 'Erro ao criar cliente no gateway' }, { status: 500 });
        }

        customerId = customer.id;
      }

      await supabase
        .from('tenants')
        .update({ asaas_customer_id: customerId })
        .eq('id', tenant.id);
    }

    // Criar cobrança
    const hoje = new Date();
    const vencimento = new Date(hoje.setDate(hoje.getDate() + 1));
    const dueDate = vencimento.toISOString().split('T')[0];

    const payment = await createPayment({
      customer: customerId,
      billingType,
      value: plano.preco_centavos / 100,
      description: `Plano ${plano.nome} - SaaS WhatsApp`,
      dueDate,
    });

    console.log('Resposta Asaas payment:', payment);

    if (payment.errors) {
      console.error('Erro Asaas cobrança:', payment.errors);

      // Se PIX não disponível, informar o usuário
      const pixError = payment.errors.find((e: any) =>
        e.description?.includes('Pix não está disponível')
      );

      if (pixError) {
        return NextResponse.json({
          error: 'PIX ainda não disponível na sua conta Asaas. Use Cartão de Crédito.'
        }, { status: 400 });
      }

      return NextResponse.json({ error: 'Erro ao criar cobrança' }, { status: 500 });
    }

    // Atualizar tenant
    await supabase
      .from('tenants')
      .update({
        plano: plano.nome.toLowerCase(),
        plano_status: 'pending',
        limite_mensagens_mes: plano.mensagens_mes,
      })
      .eq('id', tenant.id);

    // Registrar pagamento
    await supabase.from('pagamentos').insert({
      tenant_id: tenant.id,
      valor_centavos: plano.preco_centavos,
      status: 'pending',
      asaas_payment_id: payment.id,
    });

    return NextResponse.json({
      ok: true,
      checkout_url: payment.invoiceUrl || null,
      payment_id: payment.id,
    });
  } catch (err) {
    console.error('Erro plan/checkout:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}