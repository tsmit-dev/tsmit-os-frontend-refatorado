
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Client, ServiceOrder } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import api from '@/api/api';
import { toast } from 'sonner';

const formSchema = z.object({
  clientId: z.string().min(1, 'Selecione um cliente'),
  contactName: z.string().optional(),
  contactEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  equipmentType: z.string().min(1, 'O tipo do equipamento é obrigatório'),
  equipmentBrand: z.string().min(1, 'A marca do equipamento é obrigatória'),
  equipmentModel: z.string().min(1, 'O modelo do equipamento é obrigatório'),
  serialNumber: z.string().optional(),
  reportedProblem: z.string().min(1, 'O problema relatado é obrigatório'),
});

type FormValues = z.infer<typeof formSchema>;

interface EditOsDialogProps {
  os: ServiceOrder;
  children: React.ReactNode;
  onOsUpdated: (updatedOs: ServiceOrder) => void;
}

export function EditOsDialog({
  os,
  children,
  onOsUpdated,
}: EditOsDialogProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: os.clientId,
      contactName: os.collaborator.name,
      contactEmail: os.client_snapshot.email,
      equipmentType: os.equipment.type,
      equipmentBrand: os.equipment.brand,
      equipmentModel: os.equipment.model,
      serialNumber: os.equipment.serialNumber,
      reportedProblem: os.reportedProblem,
    },
  });

  useEffect(() => {
    if (open) {
      const fetchClients = async () => {
        try {
          const response = await api.get('/clients');
          setClients(response.data);
        } catch (error) {
          toast.error('Erro ao carregar clientes');
        }
      };
      fetchClients();
    }
  }, [open]);

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await api.put(`/service-orders/${os.id}`, values);
      toast.success('OS atualizada com sucesso!');
      onOsUpdated(response.data);
      setOpen(false);
    } catch (error) {
      toast.error('Erro ao atualizar OS');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Editar Ordem de Serviço</DialogTitle>
          <DialogDescription>
            Atualize os dados da OS #{os.order_number}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Email do contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Equipamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Notebook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipmentBrand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Marca do equipamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipmentModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo do equipamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Série</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de série" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="reportedProblem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problema Relatado</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o problema relatado"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Salvando...'
                  : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
