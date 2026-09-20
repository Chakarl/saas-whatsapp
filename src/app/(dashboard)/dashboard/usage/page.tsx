import { createServerSupabase } from '@/lib/supabase-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function UsagePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('plano, mensagens_usadas, limite_mensagens_mes, trial_fim')
    .eq('user_id', user!.id)
    .single();

  if (!tenant) return null;

  const usagePercent = Math.round(
    (tenant.mensagens_usadas / tenant.limite_mensagens_mes) * 100
  );

  const trialFim = tenant.trial_fim
    ? new Date(tenant.trial_fim).toLocaleDateString('pt-BR')
    : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Uso de Mensagens
      </h1>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>
            Plano atual: <span className="capitalize">{tenant.plano}</span> ({tenant.limite_mensagens_mes.toLocaleString('pt-BR')}/mês)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{tenant.mensagens_usadas.toLocaleString('pt-BR')} usadas</span>
              <span>{usagePercent}%</span>
            </div>
            <Progress value={usagePercent} />
          </div>

          <p className="text-sm text-gray-500">
            {tenant.limite_mensagens_mes - tenant.mensagens_usadas > 0
              ? `${(tenant.limite_mensagens_mes - tenant.mensagens_usadas).toLocaleString('pt-BR')} mensagens restantes`
              : 'Limite atingido — faça upgrade para continuar'}
          </p>

          {trialFim && tenant.plano === 'trial' && (
            <p className="text-sm text-amber-600">
              Seu trial expira em {trialFim}
            </p>
          )}

          <Link href="/dashboard/plan">
            <Button variant="outline" className="w-full mt-2">
              {usagePercent >= 80 ? 'Fazer upgrade' : 'Ver planos'}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}