'use client';

import { useState, useEffect } from 'react';
import { Role } from '@/interfaces';
import styles from '@/components/common/ClientForm.module.css';

interface RoleFormProps {
  role?: Role;
  onSave: (role: Omit<Role, 'id'>) => void;
  onCancel: () => void;
}

export default function RoleForm({ role, onSave, onCancel }: RoleFormProps) {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState('{}');

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissions(JSON.stringify(role.permissions, null, 2));
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedPermissions = JSON.parse(permissions);
      onSave({ name, permissions: parsedPermissions });
    } catch (error) {
      console.error('Invalid JSON for permissions', error);
      // You might want to show a user-friendly error here
      alert('As permissões devem ser um JSON válido.');
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{role ? 'Editar Cargo' : 'Adicionar Cargo'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome do Cargo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder='Permissões (em formato JSON)
Ex: {"os": ["create", "read"]}'
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
            required
            rows={10}
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
