import { IServiceJob } from '../models/ServiceJob';
import { JobStatus } from '../patterns/state/JobState';
import { CreateServiceJobDTO } from '../dtos/CreateServiceJobDTO';

export interface IServiceJobService {
  createJob(dto: CreateServiceJobDTO, customerId: string): Promise<IServiceJob>;
  getJobById(id: string): Promise<IServiceJob>;
  getJobsByRole(userId: string, role: string, garageId?: string): Promise<IServiceJob[]>;
  assignMechanic(jobId: string, mechanicId: string): Promise<IServiceJob>;
  updateStatus(jobId: string, newStatus: JobStatus, userId: string, role: string): Promise<IServiceJob>;
  updateEstimate(jobId: string, estimate: number): Promise<IServiceJob>;
  deleteJob(id: string): Promise<void>;
  getAvailableTransitions(jobId: string): Promise<JobStatus[]>;
}
