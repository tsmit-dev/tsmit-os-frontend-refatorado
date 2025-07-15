
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Edit,
  Printer,
  HardDrive,
  Briefcase,
  FileText,
  CheckCircle,
  Wrench,
  History,
  ListTree,
  RotateCcw,
  AlertCircle,
  ListTodo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { ServiceOrder, Status } from '@/interfaces';
import { StatusBadge } from '@/components/os/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import api from '@/api/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { StatusHistoryItem } from '@/components/os/StatusHistoryItem';
import { EditHistoryItem } from '@/components/os/EditHistoryItem';
import { EditOsDialog } from '@/components/os/EditOsDialog';
import Link from 'next/link';

const updateFormSchema = z.object({
  statusId: z.string(),
  noteOrSolution: z.string().optional(),
  confirmedServiceIds: z.array(z.string()).optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

export default function OsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [os, setOs] = useState<ServiceOrder | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
  });

  const fetchOsData = async () => {
    try {
      const [osResponse, statusesResponse] = await Promise.all([
        api.get(`/service-orders/${id}`),
        api.get('/statuses'),
      ]);
      setOs(osResponse.data);
      setStatuses(statusesResponse.data);
      form.setValue('statusId', osResponse.data.statusId);
    } catch (error) {
      toast.error('Erro ao carregar dados da OS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOsData();
    }
  }, [id]);

  const selectedStatus = statuses.find(
    (s) => s.id === form.watch('statusId')
  );

  const onSubmit = async (values: UpdateFormValues) => {
    if (selectedStatus?.isPickupStatus && !values.noteOrSolution) {
      form.setError('noteOrSolution', {
        type: 'manual',
        message: 'A solução técnica é obrigatória para este status.',
      });
      return;
    }

    const payload = {
      statusId: values.statusId,
      confirmedServiceIds: values.confirmedServiceIds,
      technicalSolution: selectedStatus?.isPickupStatus
        ? values.noteOrSolution
        : undefined,
      note: !selectedStatus?.isPickupStatus ? values.noteOrSolution : undefined,
    };

    try {
      await api.patch(`/service-orders/${id}/status`, payload);
      toast.success('Status da OS atualizado com sucesso');
      fetchOsData();
      form.reset();
    } catch (error) {
      toast.error('Erro ao atualizar status da OS');
    }
  };

  const handleOsUpdated = (updatedOs: ServiceOrder) => {
    setOs(updatedOs);
  };

  if (loading) {
    return (
        <PageLayout
        title="Carregando OS..."
        description="Aguarde enquanto buscamos os detalhes da sua Ordem de Serviço."
        icon={<ListTodo className="w-8 h-8 text-primary" />}
        >
            <p>Carregando...</p>
        </PageLayout>
    );
  }

  if (!os) {
    return (
        <PageLayout
        title="OS Não Encontrada"
        description="A Ordem de Serviço que você está procurando não foi encontrada."
        icon={<AlertCircle className="w-8 h-8 text-destructive" />}
      >
        <p>Ordem de Serviço não encontrada.</p>
    </PageLayout>
    );
  }

  const unconfirmedServices =
    selectedStatus?.triggersEmail &&
    os.contractedServices.length !==
      (form.watch('confirmedServiceIds')?.length || 0);

  return (
    <PageLayout
      title={`OS: ${os.order_number}`}
      description={`Aberto em ${format(
        new Date(os.createdAt),
        'dd/MM/yyyy'
      )} por ${os.analyst}`}
      icon={<ListTodo className="w-8 h-8 text-primary" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2">
            <EditOsDialog os={os} onOsUpdated={handleOsUpdated}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </EditOsDialog>
            <Link href={`/os/${id}/label`}>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir Etiqueta
                </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" /> Atualização da OS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="statusId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status.id} value={status.id}>
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedStatus?.triggersEmail && (
                    <div>
                      <FormLabel>Confirmação de Serviços</FormLabel>
                      <div className="space-y-2 mt-2">
                        {os.contractedServices.map((service) => (
                          <FormField
                            key={service.serviceId}
                            control={form.control}
                            name="confirmedServiceIds"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      service.serviceId
                                    )}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), service.serviceId]
                                        : (field.value || []).filter(
                                            (id) => id !== service.serviceId
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>{service.name}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      {unconfirmedServices && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Atenção</AlertTitle>
                          <AlertDescription>
                            Confirme todos os serviços antes de avançar.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name='noteOrSolution'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {selectedStatus?.isPickupStatus
                            ? 'Solução Técnica'
                            : 'Nota'}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              selectedStatus?.isPickupStatus
                                ? 'Descreva a solução técnica aplicada...'
                                : 'Adicione uma nota...'
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting || unconfirmedServices
                    }
                  >
                    Salvar Alterações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" /> Equipamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Tipo:</strong> {os.equipment.type}
              </p>
              <p>
                <strong>Marca:</strong> {os.equipment.brand}
              </p>
              <p>
                <strong>Modelo:</strong> {os.equipment.model}
              </p>
              <p>
                <strong>N/S:</strong> {os.equipment.serialNumber}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Cliente e Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Cliente:</strong> {os.client_snapshot.name}
              </p>
              <p>
                <strong>Email:</strong> {os.client_snapshot.email}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Problema Relatado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{os.reportedProblem}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Serviços Contratados
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {os.contractedServices.map((service) => (
                <Badge key={service.serviceId} variant="secondary">
                  {service.name}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" /> Histórico de Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {os.statusHistory.map((history, index) => (
                  <StatusHistoryItem key={index} history={history} />
                ))}
              </ul>
            </CardContent>
          </Card>
          {os.editHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTree className="w-5 h-5" /> Histórico de Edição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {os.editHistory.map((history, index) => (
                    <EditHistoryItem key={index} history={history} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
