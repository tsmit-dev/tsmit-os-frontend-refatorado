
'use client';

import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageLayout } from '@/components/layout/PageLayout';
import { NewOsSkeleton } from '@/components/os/NewOsSkeleton';
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
import { Client, Status } from '@/interfaces';
import api from '@/api/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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

export default function NewOsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse] = await Promise.all([
          api.get('/clients'),
        ]);
        setClients(clientsResponse.data);
      } catch (error) {
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await api.post('/service-orders', values);
      toast.success('OS criada com sucesso!');
      router.push(`/os/${response.data.id}`);
    } catch (error) {
      toast.error('Erro ao criar OS');
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Nova Ordem de Serviço"
        description="Preencha os dados abaixo para registrar uma nova OS."
        icon={<PlusCircle className="w-8 h-8 text-primary" />}
      >
        <NewOsSkeleton />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Nova Ordem de Serviço"
      description="Preencha os dados abaixo para registrar uma nova OS."
      icon={<PlusCircle className="w-8 h-8 text-primary" />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cliente e Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa/Cliente</FormLabel>
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
                      <FormLabel>Email/Telefone do Contato</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email ou telefone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Equipamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="equipmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Notebook, Desktop"
                          {...field}
                        />
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
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="reportedProblem"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o problema relatado pelo cliente..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Você será definido como o analista responsável por esta OS.
              </p>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Salvando...' : 'Criar OS'}
            </Button>
          </div>
        </form>
      </Form>
    </PageLayout>
  );
}
