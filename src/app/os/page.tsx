
'use client';

import { useEffect, useState } from 'react';
import { ListTodo, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PageLayout } from '@/components/layout/PageLayout';
import Link from 'next/link';
import { OsTable } from '@/components/os/OsTable';
import api from '@/api/api';
import { ServiceOrder } from '@/interfaces';
import { toast } from 'sonner';

export default function OsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [includeFinished, setIncludeFinished] = useState(false);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceOrders = async () => {
      try {
        const response = await api.get('/service-orders');
        setServiceOrders(response.data);
      } catch (error) {
        toast.error('Erro ao carregar ordens de serviço');
      } finally {
        setLoading(false);
      }
    };
    fetchServiceOrders();
  }, []);

  const finishedStatus = ['entregue', 'finalizado'];

  const filteredOs = serviceOrders
    .filter((os) => {
      if (includeFinished) return true;
      return !finishedStatus.includes(os.status.name.toLowerCase());
    })
    .filter((os) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        os.order_number.toString().includes(searchTermLower) ||
        os.client_snapshot.name.toLowerCase().includes(searchTermLower) ||
        `${os.equipment.brand} ${os.equipment.model}`
          .toLowerCase()
          .includes(searchTermLower) ||
        os.analyst.toLowerCase().includes(searchTermLower) ||
        os.status.name.toLowerCase().includes(searchTermLower)
      );
    });

  if (loading) {
    return (
      <PageLayout
        title="Todas as Ordens de Serviço"
        description="Visualize e gerencie todas as ordens de serviço registradas no sistema."
        icon={<ListTodo className="w-8 h-8 text-primary" />}
      >
        <p>Carregando...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Todas as Ordens de Serviço"
      description="Visualize e gerencie todas as ordens de serviço registradas no sistema."
      icon={<ListTodo className="w-8 h-8 text-primary" />}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Buscar por OS, cliente, equipamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80"
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-finished"
              checked={includeFinished}
              onCheckedChange={() => setIncludeFinished(!includeFinished)}
            />
            <label
              htmlFor="include-finished"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Incluir OS Finalizadas
            </label>
          </div>
          <Link href="/os/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova OS
            </Button>
          </Link>
        </div>
        <OsTable data={filteredOs} />
      </div>
    </PageLayout>
  );
}
