
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Client, Service } from '@/interfaces';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/api/api';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
  email: z
    .string()
    .email({ message: 'Formato de e-mail inválido.' })
    .optional()
    .or(z.literal('')),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  serviceIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientFormSheetProps {
  client?: Client;
  children: React.ReactNode;
  onClientAdded?: (client: Client) => void;
  onClientUpdated?: (client: Client) => void;
}

export function ClientFormSheet({
  client,
  children,
  onClientAdded,
  onClientUpdated,
}: ClientFormSheetProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || '',
      email: client?.email || '',
      cnpj: client?.cnpj || '',
      address: client?.address || '',
      serviceIds: client?.services?.map((s) => s.id) || [],
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services', error);
      }
    };

    fetchServices();
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      if (client) {
        const updatedClient = await api.put(`/clients/${client.id}`, values);
        toast.success('Cliente atualizado com sucesso!');
        if (onClientUpdated) {
          onClientUpdated(updatedClient.data);
        }
      } else {
        const newClient = await api.post('/clients', values);
        toast.success('Cliente criado com sucesso!');
        if (onClientAdded) {
          onClientAdded(newClient.data);
        }
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Ocorreu um erro ao salvar o cliente.');
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>
            {client ? 'Editar Cliente' : 'Criar Novo Cliente'}
          </SheetTitle>
          <SheetDescription>
            {client
              ? 'Atualize os dados do cliente.'
              : 'Preencha os dados do novo cliente.'}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow">
          <Form {...form}>
            <form
              id="client-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="XX.XXX.XXX/0001-XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Serviços Contratados</FormLabel>
                    {services.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="serviceIds"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        service.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== service.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {service.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="client-form" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
