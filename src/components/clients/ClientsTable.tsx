
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Client } from '@/interfaces';
  import { Briefcase, Edit, FileText, Trash2, User } from 'lucide-react';
  import { ClientFormSheet } from './ClientFormSheet';
  
  interface ClientsTableProps {
    clients: Client[];
    onClientUpdated: (client: Client) => void;
    onClientDeleted: (clientId: string) => void;
  }
  
  export function ClientsTable({
    clients,
    onClientUpdated,
    onClientDeleted,
  }: ClientsTableProps) {
    const isMobile =
      typeof window !== 'undefined' && window.innerWidth < 640;
  
    const viewProps = { clients, onClientUpdated, onClientDeleted };
  
    if (isMobile) {
      return <MobileView {...viewProps} />;
    }
  
    return <DesktopView {...viewProps} />;
  }
  
  function DesktopView({
    clients,
    onClientUpdated,
    onClientDeleted,
  }: ClientsTableProps) {
    return (
      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Serviços Contratados</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client: Client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {client.services && client.services.length > 0 ? (
                        client.services.map((service: { id: string; name: string }) => (
                          <Badge key={service.id} variant="secondary">
                            {service.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Nenhum</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{client.cnpj || 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <ClientFormSheet
                      client={client}
                      onClientUpdated={onClientUpdated}
                    >
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </ClientFormSheet>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Deletar</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso irá deletar
                            permanentemente o cliente {client.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onClientDeleted(client.id)}
                          >
                            Deletar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  function MobileView({
    clients,
    onClientUpdated,
    onClientDeleted,
  }: ClientsTableProps) {
    return (
      <div className="grid gap-4">
        {clients.length > 0 ? (
          clients.map((client: Client) => (
            <Card key={client.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" /> {client.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>{client.cnpj || 'N/A'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground mt-1" />
                  <div className="flex flex-wrap gap-1">
                    {client.services && client.services.length > 0 ? (
                      client.services.map((service: { id: string; name: string }) => (
                        <Badge key={service.id} variant="secondary">
                          {service.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Nenhum</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end space-x-2">
                <ClientFormSheet
                  client={client}
                  onClientUpdated={onClientUpdated}
                >
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </ClientFormSheet>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Deletar</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso irá deletar
                        permanentemente o cliente {client.name}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onClientDeleted(client.id)}
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            Nenhum cliente encontrado
          </p>
        )}
      </div>
    );
  }
  
