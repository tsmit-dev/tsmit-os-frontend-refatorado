'use client';

import { useState, useEffect } from 'react';
import { Status } from '@/interfaces';
import styles from '@/components/common/ClientForm.module.css';

interface StatusFormProps {
  status?: Status;
  onSave: (status: Omit<Status, 'id'>) => void;
  onCancel: () => void;
}

export default function StatusForm({ status, onSave, onCancel }: StatusFormProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (status) {
      setName(status.name);
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{status ? 'Editar Status' : 'Adicionar Status'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
