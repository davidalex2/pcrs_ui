import api from './api';
import type { Role } from '../types';

export const rolesService = {
  getAll: async (): Promise<Role[]> => {
  const response = await api.get<Role[]>('/v1/hars/roles/get/all');
    return response.data;
  },

  getById: async (id: string): Promise<Role> => {
  const response = await api.get<Role>(`/v1/hars/roles/get/${id}`);
    return response.data;
  },

  create: async (role: Role): Promise<Role> => {
  const response = await api.post<Role>('/v1/hars/roles/create', role);
    return response.data;
  },

  update: async (role: Role): Promise<Role> => {
  const response = await api.post<Role>('/v1/hars/roles/update', role);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
  await api.delete(`/v1/hars/roles/delete/${id}`);
  },
};

