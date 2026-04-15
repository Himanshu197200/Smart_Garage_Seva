import api from './api';
import { ApiResponse, Vehicle } from '../types';

export const vehicleService = {
  getMyVehicles: async (): Promise<Vehicle[]> => {
    const res = await api.get<ApiResponse<Vehicle[]>>('/vehicles');
    return res.data.data || [];
  },

  getById: async (id: string): Promise<Vehicle> => {
    const res = await api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return res.data.data!;
  },

  create: async (data: Partial<Vehicle>): Promise<Vehicle> => {
    const res = await api.post<ApiResponse<Vehicle>>('/vehicles', data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    const res = await api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
    return res.data.data!;
  },

  updateMileage: async (id: string, mileage: number): Promise<Vehicle> => {
    const res = await api.put<ApiResponse<Vehicle>>(`/vehicles/${id}/mileage`, { mileage });
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },

  getServiceHistory: async (id: string): Promise<any[]> => {
    const res = await api.get<ApiResponse<any[]>>(`/vehicles/${id}/history`);
    return res.data.data || [];
  }
};
