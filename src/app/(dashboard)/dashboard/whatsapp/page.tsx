'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw, Loader2 } from 'lucide-react';

export default function WhatsAppPage() {
  const [status, setStatus] = useState<string>('loading');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [instanceName, setInstanceName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    if (status === 'connecting' || status === 'qr_generated') {
      const interval = setInterval(checkConnection, 5000);
      return () => clearInterval(interval);
    }
  }, [status]);

  async function loadStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: tenant } = await supabase
      .from('tenants')
      .select('instance_name, instance_status')
      .eq('user_id', user.id)
      .single();

    if (tenant) {
      setInstanceName(tenant.instance_name);
      setStatus(tenant.instance_status || 'disconnected');
    } else {
      setStatus('disconnected');
    }
  }

  async function handleConnect() {
    setLoading(true);
    try {
      const res = await fetch('/api/whatsapp/connect', { method: 'POST' });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      if (data.qrcode) {
        setQrCode(data.qrcode);
        setStatus('qr_generated');
        setInstanceName(data.instanceName);
      }
    } catch (err) {
      alert('Erro ao conectar. Tente novamente.');
    }
    setLoading(false);
  }

  async function checkConnection() {
    if (!instanceName) return;

    try {
      const res = await fetch(`/api/whatsapp/status?instance=${instanceName}`);
      const data = await res.json();

      if (data.state === 'open' || data.state === 'connected') {
        setStatus('connected');
        setQrCode(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('tenants')
            .update({ instance_status: 'connected' })
            .eq('user_id', user.id);
        }
      }
    } catch (err) {
      // Silencioso — tenta de novo no próximo intervalo
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    try {
      await fetch('/api/whatsapp/disconnect', { method: 'POST' });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('tenants')
          .update({ instance_status: 'disconnected', instance_name: null })
          .eq('user_id', user.id);
      }

      setStatus('disconnected');
      setQrCode(null);
      setInstanceName(null);
    } catch (err) {
      alert('Erro ao desconectar.');
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">WhatsApp</h1>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === 'connected' ? (
              <>
                <Wifi className="text-green-500" size={20} />
                Conectado
              </>
            ) : (
              <>
                <WifiOff className="text-red-500" size={20} />
                Desconectado
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'connected' && (
            <>
              <p className="text-sm text-gray-600">
                Seu WhatsApp está conectado e o agente está ativo.
              </p>
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : null}
                Desconectar
              </Button>
            </>
          )}

          {status === 'disconnected' && (
            <>
              <p className="text-sm text-gray-600">
                Conecte seu WhatsApp para ativar o agente.
              </p>
              <Button onClick={handleConnect} disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : null}
                Gerar QR Code
              </Button>
            </>
          )}

          {(status === 'qr_generated' || status === 'connecting') && qrCode && (
            <>
              <div className="bg-white p-4 rounded-lg border flex items-center justify-center">
                <img
                  src={qrCode}
                  alt="QR Code WhatsApp"
                  className="w-64 h-64"
                />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>1. Abra o WhatsApp no celular</p>
                <p>2. Vá em Configurações → Aparelhos conectados</p>
                <p>3. Toque em "Conectar um aparelho"</p>
                <p>4. Escaneie o QR code acima</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <RefreshCw size={14} className="animate-spin" />
                Aguardando conexão...
              </div>
            </>
          )}

          {status === 'loading' && (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm text-gray-500">Carregando...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}