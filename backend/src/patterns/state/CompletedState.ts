import { IJobState, JobStatus, JobLike } from './JobState';
import Logger from '../singleton/Logger';

export class CompletedState implements IJobState {
  getName(): JobStatus {
    return JobStatus.COMPLETED;
  }

  canTransitionTo(state: JobStatus): boolean {
    return state === JobStatus.DELIVERED;
  }

  getNextStates(): JobStatus[] {
    return [JobStatus.DELIVERED];
  }

  async onEnter(job: JobLike): Promise<void> {
    Logger.getInstance().info(`Job ${job._id} completed`);
  }

  async onExit(job: JobLike): Promise<void> {
    Logger.getInstance().info(`Job ${job._id} exiting COMPLETED state`);
  }
}
