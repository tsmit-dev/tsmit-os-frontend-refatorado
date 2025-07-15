'use client';

import { useEffect, useState } from 'react';
import api from '@/api/api';
import { Role } from '@/interfaces';
import AppLayout from '@/app/AppLayout';
import RoleForm from '@/components/common/RoleForm';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data } = await api.get('/roles');
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles', error);
    }
  };

  const handleSaveRole = async (role: Omit<Role, 'id'>) => {
    try {
      if (editingRole) {
        await api.put(`/roles/${editingRole.id}`, role);
      } else {
        await api.post('/roles', role);
      }
      setIsFormOpen(false);
      setEditingRole(undefined);
      fetchRoles();
    } catch (error) {
      console.error('Failed to save role', error);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingRole(undefined);
  };

  const handleDelete = async (roleId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cargo?')) {
      try {
        await api.delete(`/roles/${roleId}`);
        fetchRoles();
      } catch (error) {
        console.error('Failed to delete role', error);
      }
    }
  };

  return (
    <AppLayout>
      <div>
        <h1>Cargos</h1>
        <button onClick={() => setIsFormOpen(true)}>Adicionar Cargo</button>
        {isFormOpen && (
          <RoleForm
            role={editingRole}
            onSave={handleSaveRole}
            onCancel={handleCancel}
          />
        )}
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Permissões</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>
                  <pre>{JSON.stringify(role.permissions, null, 2)}</pre>
                </td>
                <td>
                  <button onClick={() => handleEdit(role)}>Editar</button>
                  <button onClick={() => handleDelete(role.id)} className="delete">
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
