import api from './api';
import { ApiResponse, ServiceJob, JobStatus } from '../types';

export const jobService = {
  getJobs: async (garageId?: string): Promise<ServiceJob[]> => {
    const params = garageId ? { garageId } : {};
    const res = await api.get<ApiResponse<ServiceJob[]>>('/service-jobs', { params });
    return res.data.data || [];
  },

  getById: async (id: string): Promise<ServiceJob> => {
    const res = await api.get<ApiResponse<ServiceJob>>(`/service-jobs/${id}`);
    return res.data.data!;
  },

  create: async (data: { vehicleId: string; garageId: string; problemDescription: string }): Promise<ServiceJob> => {
    const res = await api.post<ApiResponse<ServiceJob>>('/service-jobs', data);
    return res.data.data!;
  },

  assignMechanic: async (jobId: string, mechanicId: string): Promise<ServiceJob> => {
    const res = await api.patch<ApiResponse<ServiceJob>>(`/service-jobs/${jobId}/assign`, { mechanicId });
    return res.data.data!;
  },

  updateStatus: async (jobId: string, status: JobStatus): Promise<ServiceJob> => {
    const res = await api.patch<ApiResponse<ServiceJob>>(`/service-jobs/${jobId}/status`, { status });
    return res.data.data!;
  },

  updateEstimate: async (jobId: string, costEstimate: number): Promise<ServiceJob> => {
    const res = await api.patch<ApiResponse<ServiceJob>>(`/service-jobs/${jobId}/estimate`, { costEstimate });
    return res.data.data!;
  },

  getTransitions: async (jobId: string): Promise<JobStatus[]> => {
    const res = await api.get<ApiResponse<JobStatus[]>>(`/service-jobs/${jobId}/transitions`);
    return res.data.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/service-jobs/${id}`);
  }
};
