'use client';

import { useState, useEffect } from 'react';
import { User, Role, UserPayload } from '@/interfaces';
import api from '@/api/api';
import styles from '@/components/common/ClientForm.module.css';

interface UserFormProps {
  user?: User;
  onSave: (user: UserPayload) => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await api.get('/roles');
        setRoles(data);
      } catch (error) {
        console.error('Failed to fetch roles', error);
      }
    };
    fetchRoles();

    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRoleId(user.roleId);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UserPayload = { name, email, roleId };
    if (password) {
      payload.password = password;
    }
    onSave(payload);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{user ? 'Editar Usuário' : 'Adicionar Usuário'}</h2>
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
            type="password"
            placeholder="Senha (deixe em branco para não alterar)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
            <option value="">Selecione um cargo</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
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
