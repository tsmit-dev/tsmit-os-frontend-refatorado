'use client';

import { useEffect, useState } from 'react';
import api from '@/api/api';
import { Service } from '@/interfaces';
import AppLayout from '@/app/AppLayout';
import ServiceForm from '@/components/common/ServiceForm';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(undefined);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  };

  const handleSaveService = async (service: Omit<Service, 'id'>) => {
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, service);
      } else {
        await api.post('/services', service);
      }
      setIsFormOpen(false);
      setEditingService(undefined);
      fetchServices();
    } catch (error) {
      console.error('Failed to save service', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingService(undefined);
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este serviço?')) {
      try {
        await api.delete(`/services/${serviceId}`);
        fetchServices();
      } catch (error) {
        console.error('Failed to delete service', error);
      }
    }
  };

  return (
    <AppLayout>
      <div>
        <h1>Serviços</h1>
        <button onClick={() => setIsFormOpen(true)}>Adicionar Serviço</button>
        {isFormOpen && (
          <ServiceForm
            service={editingService}
            onSave={handleSaveService}
            onCancel={handleCancel}
          />
        )}
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>
                  <button onClick={() => handleEdit(service)}>Editar</button>
                  <button onClick={() => handleDelete(service.id)} className="delete">
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
