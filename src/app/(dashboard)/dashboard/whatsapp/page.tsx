'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Wifi, WifiOff, Loader2, QrCode, Unplug, RefreshCw } from 'lucide-react';

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
    } catch {
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
    } catch {
      // retry
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
    } catch {
      alert('Erro ao desconectar.');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp</h1>
        <p className="text-sm text-gray-400 mt-1">Gerencie a conexão do seu agente</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg">
        {/* Status header */}
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            status === 'connected' ? 'bg-emerald-50' : 'bg-red-50'
          }`}>
            {status === 'connected'
              ? <Wifi size={18} className="text-emerald-500" />
              : <WifiOff size={18} className="text-red-400" />
            }
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {status === 'connected' ? 'Conectado' : status === 'loading' ? 'Carregando...' : 'Desconectado'}
            </p>
            <p className="text-xs text-gray-400">
              {status === 'connected' ? 'Seu agente está ativo e respondendo' : 'Conecte para ativar o agente'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {status === 'loading' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-gray-300" size={24} />
            </div>
          )}

          {status === 'connected' && (
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Unplug size={16} />}
              Desconectar
            </button>
          )}

          {status === 'disconnected' && (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <QrCode size={16} />}
              Gerar QR Code
            </button>
          )}

          {(status === 'qr_generated' || status === 'connecting') && qrCode && (
            <>
              <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-center">
                <img
                  src={qrCode}
                  alt="QR Code WhatsApp"
                  className="w-56 h-56 rounded-lg"
                />
              </div>
              <div className="bg-blue-50 rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-semibold text-blue-700">Como escanear:</p>
                <p className="text-xs text-blue-600">1. Abra o WhatsApp no celular</p>
                <p className="text-xs text-blue-600">2. Vá em Configurações → Aparelhos conectados</p>
                <p className="text-xs text-blue-600">3. Toque em "Conectar um aparelho"</p>
                <p className="text-xs text-blue-600">4. Escaneie o QR code acima</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-blue-500 font-medium">
                <RefreshCw size={12} className="animate-spin" />
                Aguardando conexão...
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}