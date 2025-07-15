
'use client';

import { useEffect, useState } from 'react';
import { Briefcase, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLayout } from '@/components/layout/PageLayout';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientFormSheet } from '@/components/clients/ClientFormSheet';
import { Toaster } from '@/components/ui/sonner';
import { Client } from '@/interfaces';
import api from '@/api/api';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get('/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Failed to fetch clients', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(
    (client: Client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.cnpj &&
        client.cnpj.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.address &&
        client.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addClient = (client: Client) => {
    setClients((prevClients) => [...prevClients, client]);
  };

  const updateClient = (client: Client) => {
    setClients((prevClients) =>
      prevClients.map((c) => (c.id === client.id ? client : c))
    );
  };

  const deleteClient = (clientId: string) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  return (
    <>
      <PageLayout
        title="Gerenciamento de Clientes"
        description="Nesta página, você pode gerenciar os clientes cadastrados no sistema."
        icon={<Briefcase className="w-8 h-8 text-primary" />}
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Buscar por nome, CNPJ ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            <ClientFormSheet onClientAdded={addClient}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Cliente
              </Button>
            </ClientFormSheet>
          </div>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <ClientsTable
              clients={filteredClients}
              onClientUpdated={updateClient}
              onClientDeleted={deleteClient}
            />
          )}
        </div>
      </PageLayout>
      <Toaster />
    </>
  );
}
