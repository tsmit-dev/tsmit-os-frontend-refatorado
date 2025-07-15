'use client';

import { useEffect, useState } from 'react';
import api from '@/api/api';
import { Client } from '@/interfaces';
import AppLayout from '@/app/AppLayout';
import ClientForm from '@/components/common/ClientForm';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await api.get('/clients');
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients', error);
    }
  };

  const handleSaveClient = async (client: Omit<Client, 'id'>) => {
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, client);
      } else {
        await api.post('/clients', client);
      }
      setIsFormOpen(false);
      setEditingClient(undefined);
      fetchClients();
    } catch (error) {
      console.error('Failed to save client', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingClient(undefined);
  };

  const handleDelete = async (clientId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await api.delete(`/clients/${clientId}`);
        fetchClients();
      } catch (error) {
        console.error('Failed to delete client', error);
      }
    }
  };

  return (
    <AppLayout>
      <div>
        <h1>Clientes</h1>
        <button onClick={() => setIsFormOpen(true)}>Adicionar Cliente</button>
        {isFormOpen && (
          <ClientForm
            client={editingClient}
            onSave={handleSaveClient}
            onCancel={handleCancel}
          />
        )}
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CNPJ</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.cnpj}</td>
                <td>{client.address}</td>
                <td>
                  <button onClick={() => handleEdit(client)}>Editar</button>
                  <button onClick={() => handleDelete(client.id)} className="delete">
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
