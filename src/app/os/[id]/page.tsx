'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/api/api';
import { ServiceOrder, Status } from '@/interfaces';
import AppLayout from '@/app/AppLayout';
import styles from './os-details.module.css';
import { AxiosError } from 'axios';

export default function ServiceOrderDetailPage() {
  const [os, setOs] = useState<ServiceOrder | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [newStatusId, setNewStatusId] = useState('');
  const [observation, setObservation] = useState('');
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const fetchOsDetails = useCallback(async () => {
    try {
      const { data } = await api.get(`/os/${id}`);
      setOs(data);
      setNewStatusId(data.statusId);
    } catch (error) {
      console.error('Failed to fetch OS details', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOsDetails();
      fetchStatuses();
    }
  }, [id, fetchOsDetails]);

  const fetchStatuses = async () => {
    try {
      const { data } = await api.get('/statuses');
      setStatuses(data);
    } catch (error) {
      console.error('Failed to fetch statuses', error);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusId) return;

    try {
      await api.put(`/os/${id}/status`, { newStatusId, observation });
      alert('Status atualizado com sucesso!');
      fetchOsDetails(); // Refresh details
      setObservation('');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error('Failed to update status', error);
      alert(err.response?.data?.message || 'Erro ao atualizar status.');
    }
  };

  if (!os) {
    return <AppLayout><div>Carregando...</div></AppLayout>;
  }

  const getStatusName = (statusId: string) => statuses.find(s => s.id === statusId)?.name || 'Desconhecido';

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Detalhes da OS: {os.order_number}</h1>
          <span className={styles.statusBadge} style={{ backgroundColor: '#21628E' }}>
            {getStatusName(os.statusId)}
          </span>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Informações do Cliente</h2>
            <p><strong>Nome:</strong> {os.client_snapshot.name}</p>
            <p><strong>Email:</strong> {os.client_snapshot.email}</p>
          </div>

          <div className={styles.card}>
            <h2>Equipamento</h2>
            <p><strong>Tipo:</strong> {os.equipment.type}</p>
            <p><strong>Marca:</strong> {os.equipment.brand}</p>
            <p><strong>Modelo:</strong> {os.equipment.model}</p>
            <p><strong>Nº de Série:</strong> {os.equipment.serialNumber}</p>
          </div>

          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2>Problema Relatado</h2>
            <p>{os.reportedProblem}</p>
          </div>

          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2>Serviços Contratados</h2>
            <ul>
              {os.contractedServices.map(service => (
                <li key={service.serviceId}>{service.name}</li>
              ))}
            </ul>
          </div>

          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2>Atualização de Status</h2>
            <form onSubmit={handleStatusUpdate} className={styles.statusForm}>
              <select value={newStatusId} onChange={(e) => setNewStatusId(e.target.value)}>
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
              <textarea
                placeholder="Adicionar observação (opcional)"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              />
              <button type="submit">Atualizar Status</button>
            </form>
          </div>

        </div>
        <button onClick={() => router.back()} className={styles.backButton}>Voltar</button>
      </div>
    </AppLayout>
  );
}
