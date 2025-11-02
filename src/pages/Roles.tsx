import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rolesService } from '../services/rolesService';
import type { Role } from '../types';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import RoleModal from '../components/RoleModal';

const Roles: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = !!user?.roles?.role_name && user.roles.role_name.toLowerCase() === 'admin';
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await rolesService.getAll();
      setRoles(data);
    } catch (err: any) {
      setError('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!isAdmin) return;
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    if (!isAdmin) return;
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await rolesService.delete(id);
      loadRoles();
    } catch (err: any) {
      alert('Failed to delete role');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    loadRoles();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {!isAdmin && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Unauthorized</h2>
          <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
          <div className="flex justify-center">
            <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
          </div>
        </div>
      )}
      {isAdmin && (
        <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Roles Management</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        {isAdmin && (
          <button onClick={handleCreate} className="btn btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Role
          </button>
        )}
      </div>

      )}{error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="card">
        {roles.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No roles found</p>
            {isAdmin && (
              <button onClick={handleCreate} className="btn btn-primary">
                Create First Role
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.role_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-primary-600 mr-2" />
                        <span className="font-medium text-gray-900">{role.role_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.role_level || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {role.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEdit(role)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            <Edit className="w-5 h-5 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(role.role_id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5 inline" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <RoleModal role={editingRole} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Roles;

