import api from './api';
import type { RentalOrder } from '../types';

export const rentalOrdersService = {
  create: async (order: RentalOrder): Promise<RentalOrder> => {
  const response = await api.post<RentalOrder>('/v1/hars/rental-orders/create', order);
    return response.data;
  },

  getById: async (id: string): Promise<RentalOrder> => {
  const response = await api.get<RentalOrder>(`/v1/hars/rental-orders/${id}`);
    return response.data;
  },

  getByUserId: async (userId: string): Promise<RentalOrder[]> => {
  const response = await api.get<RentalOrder[]>(`/v1/hars/rental-orders/user/${userId}`);
    return response.data;
  },
};
