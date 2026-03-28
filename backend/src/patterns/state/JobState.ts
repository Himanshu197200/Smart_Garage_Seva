import { Document } from 'mongoose';

export enum JobStatus {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELIVERED = 'DELIVERED'
}

export interface JobLike {
  _id: any;
  status: JobStatus;
  assignedMechanicId?: any;
}

export interface IJobState {
  getName(): JobStatus;
  canTransitionTo(state: JobStatus): boolean;
  getNextStates(): JobStatus[];
  onEnter(job: JobLike): Promise<void>;
  onExit(job: JobLike): Promise<void>;
}
