
'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, AlertCircle, CheckCircle, Clock, FileText, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ServiceOrder, Status } from '@/interfaces';
import api from '@/api/api';
import { useStatuses } from '@/contexts/StatusContext';

const iconMap: { [key: string]: React.ElementType } = {
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    Wrench,
    LayoutDashboard,
    Users
};

const renderIcon = (iconName: string, color: string) => {
    const IconComponent = iconMap[iconName] || LayoutDashboard;
    return <IconComponent className="h-4 w-4" style={{ color }} />;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, hasPermission } = useAuth();
  const router = useRouter();
  const { statuses } = useStatuses();

  useEffect(() => {
    if (!user) return;
    if (!hasPermission('dashboard')) {
      toast.error('Acesso Negado', {
        description: 'Você não tem permissão para acessar esta página.',
      });
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/service-orders');
        const serviceOrders: ServiceOrder[] = response.data;

        const activeOs = serviceOrders.filter(os => !statuses.find((s: Status) => s.id === os.statusId)?.isFinal).length;

        const statusStats = statuses.map((status: Status) => ({
          ...status,
          count: serviceOrders.filter(os => os.statusId === status.id).length
        }));
        
        const analystCreatedStats: { [key: string]: number } = {};
        serviceOrders.forEach(os => {
            analystCreatedStats[os.analyst] = (analystCreatedStats[os.analyst] || 0) + 1;
        });
        const analystCreatedStatsArray = Object.entries(analystCreatedStats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        const analystDeliveredStats: { [key: string]: number } = {};
        serviceOrders.forEach(os => {
            const finalLog = os.statusHistory.find(log => statuses.find((s: Status) => s.name === log.toStatus.name)?.isFinal);
            if (finalLog) {
                analystDeliveredStats[finalLog.user.name] = (analystDeliveredStats[finalLog.user.name] || 0) + 1;
            }
        });

        const analystDeliveredStatsArray = Object.entries(analystDeliveredStats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        setStats({ activeOs, statusStats, analystCreatedStatsArray, analystDeliveredStatsArray });

      } catch (error) {
        toast.error('Erro ao Carregar Estatísticas', {
          description: 'Não foi possível carregar os dados do dashboard.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (statuses.length > 0) {
      fetchStats();
    }
  }, [user, hasPermission, router, statuses]);

  if (loading || !stats) {
    return (
      <PageLayout
        title="Dashboard"
        description="Métricas e estatísticas do sistema."
        icon={<LayoutDashboard className="w-8 h-8 text-primary" />}
      >
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </PageLayout>
    );
  }

  const { activeOs, statusStats, analystCreatedStatsArray, analystDeliveredStatsArray } = stats;

  return (
    <PageLayout
      title="Dashboard"
      description="Visão geral e métricas do sistema."
      icon={<LayoutDashboard className="w-8 h-8 text-primary" />}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de OS Ativas
              </CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOs}</div>
              <p className="text-xs text-muted-foreground">
                Ordens de Serviço não finalizadas
              </p>
            </CardContent>
          </Card>
          {statusStats.map((stat: any) => (
            <Card key={stat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  OS {stat.name}
                </CardTitle>
                {renderIcon(stat.icon, stat.color)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {analystCreatedStatsArray?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">OS Criadas por Analista</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                {analystCreatedStatsArray.map((analyst: any) => (
                  <div key={analyst.name} className="flex items-center justify-between text-sm">
                    <span>{analyst.name}</span>
                    <span className="font-bold">{analyst.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {analystDeliveredStatsArray?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">OS Finalizadas por Analista</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                {analystDeliveredStatsArray.map((analyst: any) => (
                  <div key={analyst.name} className="flex items-center justify-between text-sm">
                    <span>{analyst.name}</span>
                    <span className="font-bold">{analyst.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
