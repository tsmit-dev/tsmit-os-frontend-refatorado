
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ServiceOrder } from '@/interfaces';
import api from '@/api/api';
import { toast } from 'sonner';
import { ArrowLeft, Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PrintLabelPage() {
  const { id } = useParams();
  const router = useRouter();
  const [os, setOs] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchOs = async () => {
        try {
          const response = await api.get(`/service-orders/${id}`);
          setOs(response.data);
        } catch (error) {
          toast.error('Falha ao carregar os dados da OS.');
        } finally {
          setLoading(false);
        }
      };
      fetchOs();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white dark:bg-black rounded-lg shadow-lg p-6 print:shadow-none">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : os ? (
          <div className="border-2 border-dashed border-gray-400 p-6">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold">Ordem de Serviço</h1>
              <h2 className="text-4xl font-extrabold text-primary">{os.order_number}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Cliente:</p>
                <p>{os.client_snapshot.name}</p>
              </div>
              <div>
                <p className="font-semibold">Analista:</p>
                <p>{os.analyst}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Equipamento:</p>
                <p>{`${os.equipment.type} ${os.equipment.brand} ${os.equipment.model}`}</p>
                <p>N/S: {os.equipment.serialNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Problema Relatado:</p>
                <p>{os.reportedProblem}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">
            Não foi possível carregar os dados da Ordem de Serviço.
          </p>
        )}
      </div>
    </div>
  );
}
