import { IJobState, JobStatus, JobLike } from './JobState';
import Logger from '../singleton/Logger';

export class DeliveredState implements IJobState {
  getName(): JobStatus {
    return JobStatus.DELIVERED;
  }

  canTransitionTo(_state: JobStatus): boolean {
    return false;
  }

  getNextStates(): JobStatus[] {
    return [];
  }

  async onEnter(job: JobLike): Promise<void> {
    Logger.getInstance().info(`Job ${job._id} delivered to customer`);
  }

  async onExit(job: JobLike): Promise<void> {
    Logger.getInstance().warn(`Attempted to exit DELIVERED state for job ${job._id}`);
  }
}
