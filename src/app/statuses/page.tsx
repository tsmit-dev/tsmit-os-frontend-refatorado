'use client';

import { useEffect, useState } from 'react';
import api from '@/api/api';
import { Status } from '@/interfaces';
import AppLayout from '@/app/AppLayout';
import StatusForm from '@/components/common/StatusForm';

export default function StatusesPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | undefined>(undefined);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const { data } = await api.get('/statuses');
      setStatuses(data);
    } catch (error) {
      console.error('Failed to fetch statuses', error);
    }
  };

  const handleSaveStatus = async (status: Omit<Status, 'id'>) => {
    try {
      if (editingStatus) {
        await api.put(`/statuses/${editingStatus.id}`, status);
      } else {
        await api.post('/statuses', status);
      }
      setIsFormOpen(false);
      setEditingStatus(undefined);
      fetchStatuses();
    } catch (error) {
      console.error('Failed to save status', error);
    }
  };

  const handleEdit = (status: Status) => {
    setEditingStatus(status);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingStatus(undefined);
  };

  const handleDelete = async (statusId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este status?')) {
      try {
        await api.delete(`/statuses/${statusId}`);
        fetchStatuses();
      } catch (error) {
        console.error('Failed to delete status', error);
      }
    }
  };

  return (
    <AppLayout>
      <div>
        <h1>Status</h1>
        <button onClick={() => setIsFormOpen(true)}>Adicionar Status</button>
        {isFormOpen && (
          <StatusForm
            status={editingStatus}
            onSave={handleSaveStatus}
            onCancel={handleCancel}
          />
        )}
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((status) => (
              <tr key={status.id}>
                <td>{status.name}</td>
                <td>
                  <button onClick={() => handleEdit(status)}>Editar</button>
                  <button onClick={() => handleDelete(status.id)} className="delete">
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
