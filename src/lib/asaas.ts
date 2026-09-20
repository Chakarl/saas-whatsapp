const ASAAS_URL = process.env.ASAAS_API_URL!;
const ASAAS_KEY = process.env.ASAAS_API_KEY!;

const headers = {
  'Content-Type': 'application/json',
  'access_token': ASAAS_KEY,
};

// Criar cliente no Asaas
export async function createCustomer(data: {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}) {
  const res = await fetch(`${ASAAS_URL}/customers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      cpfCnpj: data.cpfCnpj || undefined,
      mobilePhone: data.phone || undefined,
    }),
  });
  return res.json();
}

// Buscar cliente por email
export async function findCustomerByEmail(email: string) {
  const res = await fetch(`${ASAAS_URL}/customers?email=${encodeURIComponent(email)}`, {
    headers,
  });
  const data = await res.json();
  return data.data?.[0] || null;
}

// Criar assinatura recorrente
export async function createSubscription(data: {
  customer: string;
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  value: number;
  cycle: 'MONTHLY';
  description: string;
  nextDueDate: string;
}) {
  const res = await fetch(`${ASAAS_URL}/subscriptions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      customer: data.customer,
      billingType: data.billingType,
      value: data.value,
      cycle: data.cycle,
      description: data.description,
      nextDueDate: data.nextDueDate,
    }),
  });
  return res.json();
}

// Criar cobrança avulsa (PIX)
export async function createPayment(data: {
  customer: string;
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  value: number;
  description: string;
  dueDate: string;
}) {
  const res = await fetch(`${ASAAS_URL}/payments`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      customer: data.customer,
      billingType: data.billingType,
      value: data.value,
      description: data.description,
      dueDate: data.dueDate,
    }),
  });
  return res.json();
}

// Buscar QR Code PIX de uma cobrança
export async function getPixQRCode(paymentId: string) {
  const res = await fetch(`${ASAAS_URL}/payments/${paymentId}/pixQrCode`, {
    headers,
  });
  return res.json();
}

// Cancelar assinatura
export async function cancelSubscription(subscriptionId: string) {
  const res = await fetch(`${ASAAS_URL}/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}
// Atualizar cliente existente
export async function updateCustomer(customerId: string, data: {
  name?: string;
  cpfCnpj?: string;
  phone?: string;
}) {
  const res = await fetch(`${ASAAS_URL}/customers/${customerId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}