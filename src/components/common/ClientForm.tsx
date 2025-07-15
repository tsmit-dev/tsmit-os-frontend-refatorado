'use client';

import { useState, useEffect } from 'react';
import { Client } from '@/interfaces';
import styles from './ClientForm.module.css';

interface ClientFormProps {
  client?: Client;
  onSave: (client: Omit<Client, 'id'>) => void;
  onCancel: () => void;
}

export default function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setCnpj(client.cnpj);
      setAddress(client.address);
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, cnpj, address });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{client ? 'Editar Cliente' : 'Adicionar Cliente'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />
          <input
            type="text"
            placeholder="Endereço"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
