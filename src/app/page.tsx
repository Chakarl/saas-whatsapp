import Link from 'next/link';
import { Check, MessageSquare, Bot, Zap, Shield, BarChart3, Headphones } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={28} className="text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Agente de Crédito</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Criar conta grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          🚀 Seu atendente inteligente no WhatsApp
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Atenda seus clientes 24h<br />
          com <span className="text-blue-600">Inteligência Artificial</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Crie seu Agente de Crédito de IA personalizado, conecte ao WhatsApp e deixe ele
          responder, vender e atender seus clientes automaticamente — sem código,
          sem complicação.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-lg text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Começar agora
          </Link>
          <a
            href="#precos"
            className="text-gray-600 font-medium px-8 py-3.5 rounded-lg text-lg hover:bg-gray-50 transition border"
          >
            Ver preços
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Teste grátis por 7 dias • Sem cartão de crédito
        </p>
      </section>

      {/* Benefícios */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tudo que você precisa pra automatizar seu atendimento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                WhatsApp conectado
              </h3>
              <p className="text-gray-500 text-sm">
                Conecte seu número em segundos via QR Code. Sem API oficial, sem burocracia.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Bot size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                IA Personalizada
              </h3>
              <p className="text-gray-500 text-sm">
                Configure o nome, tom de voz, regras e conhecimento do seu agente. Ele fala como você.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <Zap size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Respostas instantâneas
              </h3>
              <p className="text-gray-500 text-sm">
                Seu Agente de Crédito responde em segundos, 24 horas por dia, 7 dias por semana. Nunca perde um cliente.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                <Shield size={24} className="text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seguro e privado
              </h3>
              <p className="text-gray-500 text-sm">
                Seus dados são criptografados. Cada conta é isolada. Ninguém acessa suas conversas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Painel de controle
              </h3>
              <p className="text-gray-500 text-sm">
                Acompanhe mensagens enviadas, status da conexão e gerencie seu plano em tempo real.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                <Headphones size={24} className="text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Suporte humano
              </h3>
              <p className="text-gray-500 text-sm">
                Precisa de ajuda? Nossa equipe está disponível via WhatsApp pra te ajudar a configurar tudo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Funciona em 3 passos simples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Crie sua conta
              </h3>
              <p className="text-gray-500 text-sm">
                Cadastre-se em menos de 1 minuto. Sem cartão de crédito.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personalize seu agente
              </h3>
              <p className="text-gray-500 text-sm">
                Defina o nome, tom de voz e regras de atendimento do seu assistente.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Conecte o WhatsApp
              </h3>
              <p className="text-gray-500 text-sm">
                Escaneie o QR Code e pronto — seu Agente de Crédito já está atendendo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Planos que cabem no seu bolso
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Comece grátis e escale conforme sua demanda
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
              <p className="text-3xl font-bold mt-3">
                R$ 97<span className="text-sm font-normal text-gray-500">/mês</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> 500 mensagens/mês
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Agente personalizado
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> WhatsApp 24h
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Suporte por WhatsApp
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-900 text-white font-medium py-2.5 rounded-lg mt-6 hover:bg-gray-800 transition"
              >
                Começar
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Mais popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <p className="text-3xl font-bold mt-3">
                R$ 197<span className="text-sm font-normal text-gray-500">/mês</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> 2.000 mensagens/mês
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Agente personalizado
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> WhatsApp 24h
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Suporte prioritário
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-blue-600 text-white font-medium py-2.5 rounded-lg mt-6 hover:bg-blue-700 transition"
              >
                Começar
              </Link>
            </div>

            {/* Business */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Business</h3>
              <p className="text-3xl font-bold mt-3">
                R$ 397<span className="text-sm font-normal text-gray-500">/mês</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> 5.000 mensagens/mês
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Agente personalizado
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> WhatsApp 24h
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Suporte dedicado
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-900 text-white font-medium py-2.5 rounded-lg mt-6 hover:bg-gray-800 transition"
              >
                Começar
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Enterprise</h3>
              <p className="text-3xl font-bold mt-3">
                R$ 797<span className="text-sm font-normal text-gray-500">/mês</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Mensagens ilimitadas
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Agente personalizado
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> WhatsApp 24h
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Suporte VIP
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-900 text-white font-medium py-2.5 rounded-lg mt-6 hover:bg-gray-800 transition"
              >
                Começar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto pra transformar seu atendimento?
          </h2>
          <p className="text-gray-500 mb-8">
            Junte-se a centenas de empresas que já automatizaram o WhatsApp com IA.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-lg text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Criar conta grátis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Bot size={18} />
            <span>Agente de Crédito © 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600">Termos</a>
            <a href="#" className="hover:text-gray-600">Privacidade</a>
            <a href="#" className="hover:text-gray-600">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}