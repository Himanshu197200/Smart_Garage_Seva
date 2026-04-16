import api from './api';
import { ApiResponse, InventoryItem } from '../types';

export const inventoryService = {
  getInventory: async (garageId?: string): Promise<InventoryItem[]> => {
    const params = garageId ? { garageId } : {};
    const res = await api.get<ApiResponse<InventoryItem[]>>('/inventory', { params });
    return res.data.data || [];
  },

  getLowStock: async (): Promise<InventoryItem[]> => {
    const res = await api.get<ApiResponse<InventoryItem[]>>('/inventory/low-stock');
    return res.data.data || [];
  },

  create: async (data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const res = await api.post<ApiResponse<InventoryItem>>('/inventory', data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const res = await api.put<ApiResponse<InventoryItem>>(`/inventory/${id}`, data);
    return res.data.data!;
  },

  updateStock: async (id: string, quantity: number): Promise<InventoryItem> => {
    const res = await api.patch<ApiResponse<InventoryItem>>(`/inventory/${id}/stock`, { quantity });
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  }
};
