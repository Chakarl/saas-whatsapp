import Link from 'next/link';
import { Check, MessageSquare, Bot, Zap, Shield, BarChart3, Headphones, Gift, ArrowRight, Star, Clock, TrendingUp, Users, ChevronRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Agente de Crédito</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition font-medium">
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/20"
            >
              Testar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-5 py-2 rounded-full mb-8 border border-blue-100">
            <Sparkles size={14} />
            Teste grátis por 7 dias · Sem cartão de crédito
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Pare de perder clientes<br />
            no <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">WhatsApp</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-4 leading-relaxed font-light">
            Seu agente de IA responde, qualifica e converte leads <strong className="text-gray-700 font-semibold">24 horas por dia</strong> — enquanto você foca no que importa.
          </p>

          <p className="text-lg text-gray-400 mb-10">
            Configuração em 2 minutos. Zero código. Resultado imediato.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/register"
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Começar grátis agora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#precos"
              className="flex items-center gap-2 text-gray-600 font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-gray-50 transition border border-gray-200"
            >
              Ver planos
              <ChevronRight size={18} />
            </a>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white" />
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white" />
              </div>
              Empresas já usando
            </span>
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              4.9/5 de satisfação
            </span>
          </div>
        </div>
      </section>

      {/* Problema → Solução */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enquanto você dorme, seus clientes vão embora
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              78% dos leads compram de quem responde primeiro. Cada minuto sem resposta é dinheiro perdido.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                <Clock size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Demora pra responder?</h3>
              <p className="text-gray-400 text-sm">O lead esfria em 5 minutos. Seu concorrente responde em 30 segundos com IA.</p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} className="text-orange-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Equipe sobrecarregada?</h3>
              <p className="text-gray-400 text-sm">Perguntas repetitivas consomem horas. A IA resolve 80% sem intervenção humana.</p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Quer escalar vendas?</h3>
              <p className="text-gray-400 text-sm">Com IA, você atende 100 ou 10.000 leads simultaneamente. Sem contratar ninguém.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">Por que escolher</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Seu agente trabalha 24h, você descansa
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Tudo que você precisa pra transformar seu WhatsApp numa máquina de vendas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">WhatsApp em 1 clique</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Escaneie o QR Code e pronto. Sem API oficial, sem burocracia, sem esperar aprovação.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">IA que fala como você</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Defina o nome, tom de voz, regras e a base de conhecimento. O agente vira sua extensão.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Respostas em segundos</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enquanto humanos demoram minutos, seu agente responde instantaneamente. 24/7/365.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield size={24} className="text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dados protegidos</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Criptografia total. Cada conta é isolada. Ninguém acessa suas conversas.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dashboard em tempo real</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Veja mensagens, status do agente e métricas do seu atendimento num painel limpo.
              </p>
            </div>

            <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Headphones size={24} className="text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Suporte de verdade</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Não é chatbot de suporte. É gente real, no WhatsApp, pronta pra te ajudar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">Simples assim</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              3 passos e seu agente está no ar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Crie sua conta grátis</h3>
              <p className="text-gray-500 text-sm">Nome, email e senha. Menos de 60 segundos. Sem cartão.</p>
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-blue-200 to-transparent" />
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/20">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Personalize o agente</h3>
              <p className="text-gray-500 text-sm">Defina nome, tom de voz, regras e treine com sua base de conhecimento.</p>
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-blue-200 to-transparent" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Conecte e venda</h3>
              <p className="text-gray-500 text-sm">Escaneie o QR Code do WhatsApp. Seu agente começa a atender na hora.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/25"
            >
              Quero testar grátis
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">Preços transparentes</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Comece grátis, escale quando quiser
            </h2>
            <p className="text-gray-500 text-lg">
              Sem surpresas, sem taxa escondida. Cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Free */}
            <div className="bg-gradient-to-b from-emerald-50 to-white rounded-2xl p-6 border-2 border-emerald-300 relative hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow">
                <Gift size={10} /> GRÁTIS
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-2">Free</h3>
              <p className="text-3xl font-extrabold mt-3">
                R$ 0<span className="text-sm font-normal text-gray-400">/7 dias</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Sem cartão de crédito</p>
              <ul className="mt-5 space-y-2.5 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> 50 mensagens</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> 7 dias de teste</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Agente personalizado</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> WhatsApp 24h</li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 rounded-xl mt-6 hover:from-emerald-600 hover:to-emerald-700 transition shadow-lg shadow-emerald-500/20"
              >
                Começar grátis
              </Link>
            </div>

            {/* Starter */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900">Starter</h3>
              <p className="text-3xl font-extrabold mt-3">
                R$ 97<span className="text-sm font-normal text-gray-400">/mês</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Para quem está começando</p>
              <ul className="mt-5 space-y-2.5 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> 500 mensagens/mês</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> Agente personalizado</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> WhatsApp 24h</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> Suporte por WhatsApp</li>
              </ul>
              <Link
                href="/register?plano=starter"
                className="block w-full text-center bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl mt-6 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition"
              >
                Escolher Starter
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl p-6 border-2 border-blue-500 relative hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow">
                <Sparkles size={10} /> MAIS POPULAR
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-2">Pro</h3>
              <p className="text-3xl font-extrabold mt-3">
                R$ 197<span className="text-sm font-normal text-gray-400">/mês</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Melhor custo-benefício</p>
              <ul className="mt-5 space-y-2.5 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> 2.000 mensagens/mês</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> Agente personalizado</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> WhatsApp 24h</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> Suporte prioritário</li>
              </ul>
              <Link
                href="/register?plano=pro"
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl mt-6 hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/20"
              >
                Escolher Pro
              </Link>
            </div>

            {/* Business */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900">Business</h3>
              <p className="text-3xl font-extrabold mt-3">
                R$ 397<span className="text-sm font-normal text-gray-400">/mês</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Para equipes em crescimento</p>
              <ul className="mt-5 space-y-2.5 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> 5.000 mensagens/mês</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> Agente personalizado</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> WhatsApp 24h</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> Suporte dedicado</li>
              </ul>
              <Link
                href="/register?plano=business"
                className="block w-full text-center bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl mt-6 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition"
              >
                Escolher Business
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900">Enterprise</h3>
              <p className="text-3xl font-extrabold mt-3">
                R$ 797<span className="text-sm font-normal text-gray-400">/mês</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Para operações de alto volume</p>
              <ul className="mt-5 space-y-2.5 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> Mensagens ilimitadas</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> Agente personalizado</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> WhatsApp 24h</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> Suporte VIP</li>
              </ul>
              <Link
                href="/register?plano=enterprise"
                className="block w-full text-center bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl mt-6 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition"
              >
                Escolher Enterprise
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Pagamento seguro via PIX ou cartão · Cancele quando quiser · Sem fidelidade
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-gray-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Cada minuto sem IA é um<br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">cliente perdido</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Comece agora com 50 mensagens grátis. Sem cartão, sem compromisso. Se não gostar, é só não continuar.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-10 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-0.5"
          >
            Criar minha conta grátis
            <ArrowRight size={20} />
          </Link>
          <p className="text-gray-500 text-sm mt-6">
            ✅ 7 dias grátis · ✅ 50 mensagens · ✅ Setup em 2 minutos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-400">Agente de Crédito</span>
          </div>
          <p className="text-xs text-gray-500">
            © 2026 Agente de Crédito. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}