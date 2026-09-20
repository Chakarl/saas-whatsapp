import { Resend } from 'resend';

let resend: Resend;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = 'Agente de Crédito <onboarding@resend.dev>';

export async function sendWelcomeEmail(to: string, nome: string) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: '🚀 Bem-vindo ao Agente de Crédito!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Agente de Crédito</h1>
          <p style="color: #6b7280; margin-top: 4px;">Seu Agente de Crédito inteligente no WhatsApp</p>
        </div>

        <h2 style="color: #111827;">Olá, ${nome}! 👋</h2>

        <p style="color: #374151; line-height: 1.6;">
          Sua conta foi criada com sucesso! Agora você pode configurar seu Agente de Crédito de IA
          e conectar ao WhatsApp em poucos minutos.
        </p>

        <h3 style="color: #111827;">Próximos passos:</h3>

        <ol style="color: #374151; line-height: 2;">
          <li><strong>Personalize seu agente</strong> — Defina nome, tom de voz e regras</li>
          <li><strong>Conecte o WhatsApp</strong> — Escaneie o QR Code no painel</li>
          <li><strong>Escolha um plano</strong> — Comece com o Starter por R$ 97/mês</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://saas-whatsapp-tau.vercel.app/dashboard"
             style="background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Acessar meu painel
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 40px;">
          Se precisar de ajuda, responda este email ou nos chame no WhatsApp.
        </p>
      </div>
    `,
  });
}

export async function sendPaymentConfirmedEmail(to: string, nome: string, plano: string) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: '✅ Pagamento confirmado — Agente de Crédito',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Agente de Crédito</h1>
        </div>

        <h2 style="color: #111827;">Pagamento confirmado! ✅</h2>

        <p style="color: #374151; line-height: 1.6;">
          Olá, ${nome}! Seu pagamento do plano <strong>${plano}</strong> foi confirmado
          com sucesso. Seu contador de mensagens foi resetado e você já pode continuar
          usando normalmente.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://saas-whatsapp-tau.vercel.app/dashboard"
             style="background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Acessar meu painel
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 40px;">
          Agente de Crédito — Seu consultor de crédito inteligente no WhatsApp
        </p>
      </div>
    `,
  });
}

export async function sendPaymentOverdueEmail(to: string, nome: string) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: '⚠️ Pagamento pendente — Agente de Crédito',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Agente de Crédito</h1>
        </div>

        <h2 style="color: #111827;">Seu pagamento está pendente ⚠️</h2>

        <p style="color: #374151; line-height: 1.6;">
          Olá, ${nome}! Identificamos que seu pagamento está vencido. Para manter seu
          agente funcionando sem interrupção, regularize o quanto antes.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://saas-whatsapp-tau.vercel.app/dashboard/plan"
             style="background-color: #dc2626; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Regularizar pagamento
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 40px;">
          Se já efetuou o pagamento, desconsidere este email.
        </p>
      </div>
    `,
  });
}