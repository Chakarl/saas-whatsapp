const EVOLUTION_URL = process.env.EVOLUTION_API_URL!;
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY!;

export async function createInstance(instanceName: string, webhookUrl: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_KEY
    },
    body: JSON.stringify({
      instanceName,
      integration: 'WHATSAPP-BAILEYS',
      webhook: {
        enabled: true,
        url: webhookUrl,
        events: ['messages.upsert', 'connection.update']
      },
      qrcode: true
    })
  });
  return res.json();
}

export async function getQRCode(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/connect/${instanceName}`, {
    headers: { 'apikey': EVOLUTION_KEY }
  });
  const data = await res.json();

  // Evolution pode retornar o QR em diferentes formatos
  const base64 = data.base64 || data.qrcode?.base64 || data.code || null;
  const pairingCode = data.pairingCode || null;

  return { base64, pairingCode, raw: data };
}

export async function getStatus(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/connectionState/${instanceName}`, {
    headers: { 'apikey': EVOLUTION_KEY }
  });
  const data = await res.json();

  // Normalizar resposta
  const state = data.instance?.state || data.state || 'disconnected';

  return { state, raw: data };
}

export async function disconnectInstance(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/logout/${instanceName}`, {
    method: 'DELETE',
    headers: { 'apikey': EVOLUTION_KEY }
  });
  return res.json();
}

export async function deleteInstance(instanceName: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/delete/${instanceName}`, {
    method: 'DELETE',
    headers: { 'apikey': EVOLUTION_KEY }
  });
  return res.json();
}

export async function validateInstanceOwnership(
  tenantId: string,
  instanceName: string,
  supabase: any
): Promise<boolean> {
  const { data } = await supabase
    .from('tenants')
    .select('instance_name')
    .eq('id', tenantId)
    .single();

  return data?.instance_name === instanceName;
}