import api from './api';
import type { RentalItem } from '../types';

export const rentalItemsService = {
  getAll: async (): Promise<RentalItem[]> => {
  const response = await api.get<RentalItem[]>('/v1/hars/rental/items/all');
    return response.data;
  },

  getById: async (id: string): Promise<RentalItem> => {
  const response = await api.get<RentalItem>(`/v1/hars/rental/items/${id}`);
    return response.data;
  },

  getByUserId: async (userId: string): Promise<RentalItem[]> => {
  const response = await api.get<RentalItem[]>(`/v1/hars/rental/items/user/${userId}`);
    return response.data;
  },

  create: async (item: RentalItem): Promise<RentalItem> => {
  const response = await api.post<RentalItem>('/v1/hars/rental/items/create', item);
    return response.data;
  },

  update: async (id: string, item: RentalItem): Promise<RentalItem> => {
  const response = await api.put<RentalItem>(`/v1/hars/rental/items/${id}`, item);
    return response.data;
  },

  uploadImages: async (itemId: string, files: File[] | FileList): Promise<string[]> => {
    const formData = new FormData();
    // append multiple files with the 'images' key
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

  const response = await api.post<string[]>(`/v1/hars/rental/items/${itemId}/upload-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Controller returns a message string; but the backend sets image_names on the item.
    // We return the response data (could be an array of urls or a message).
    return response.data as unknown as string[];
  },

  delete: async (id: string): Promise<void> => {
  await api.delete(`/v1/hars/rental/items/${id}`);
  },
};

