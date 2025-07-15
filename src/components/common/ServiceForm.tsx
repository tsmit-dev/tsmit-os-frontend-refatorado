'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/interfaces';
import styles from '@/components/common/ClientForm.module.css'; // Reusing the same style

interface ServiceFormProps {
  service?: Service;
  onSave: (service: Omit<Service, 'id'>) => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{service ? 'Editar Serviço' : 'Adicionar Serviço'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className={styles.buttons}>
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
