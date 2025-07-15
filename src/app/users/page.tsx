'use client';

import { useEffect, useState } from 'react';
import api from '@/api/api';
import { User, Role, UserPayload } from '@/interfaces';
import AppLayout from '@/app/AppLayout';
import UserForm from '@/components/common/UserForm';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await api.get('/roles');
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles', error);
    }
  };

  const handleSaveUser = async (user: UserPayload) => {
    try {
      // The user payload is already correctly typed, so we can use it directly
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, user);
      } else {
        await api.post('/users', user);
      }
      setIsFormOpen(false);
      setEditingUser(undefined);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingUser(undefined);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : 'N/A';
  };

  return (
    <AppLayout>
      <div>
        <h1>Usuários</h1>
        <button onClick={() => setIsFormOpen(true)}>Adicionar Usuário</button>
        {isFormOpen && (
          <UserForm
            user={editingUser}
            onSave={handleSaveUser}
            onCancel={handleCancel}
          />
        )}
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{getRoleName(user.roleId)}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => handleDelete(user.id)} className="delete">
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
