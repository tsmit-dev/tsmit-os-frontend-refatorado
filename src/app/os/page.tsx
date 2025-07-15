'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/api/api';
import { ServiceOrder, Client, User, Status } from '@/interfaces';
import AppLayout from '@/app/AppLayout';

export default function ServiceOrdersPage() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    fetchServiceOrders();
    fetchRelatedData();
  }, []);

  const fetchServiceOrders = async () => {
    try {
      const { data } = await api.get('/os');
      setServiceOrders(data);
    } catch (error) {
      console.error('Failed to fetch service orders', error);
    }
  };

  const fetchRelatedData = async () => {
    try {
      const [clientsRes, usersRes, statusesRes] = await Promise.all([
        api.get('/clients'),
        api.get('/users'),
        api.get('/statuses'),
      ]);
      setClients(clientsRes.data);
      setUsers(usersRes.data);
      setStatuses(statusesRes.data);
    } catch (error) {
      console.error('Failed to fetch related data', error);
    }
  };

  const getNameById = (collection: any[], id: string) => {
    const item = collection.find((item) => item.id === id);
    return item ? item.name : 'N/A';
  };

  return (
    <AppLayout>
      <div>
        <h1>Ordens de Serviço</h1>
        <Link href="/os/new">
          <button>Adicionar OS</button>
        </Link>
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Analista</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {serviceOrders.map((os) => (
              <tr key={os.id}>
                <td>{os.order_number}</td>
                <td>{getNameById(clients, os.clientId)}</td>
                <td>{os.analyst}</td>
                <td>{getNameById(statuses, os.statusId)}</td>
                <td>
                  <Link href={`/os/${os.id}`}>
                    <button>Ver Detalhes</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
