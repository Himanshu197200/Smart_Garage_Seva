import { IJobState, JobStatus, JobLike } from './JobState';
import Logger from '../singleton/Logger';

export class InProgressState implements IJobState {
  getName(): JobStatus {
    return JobStatus.IN_PROGRESS;
  }

  canTransitionTo(state: JobStatus): boolean {
    return state === JobStatus.COMPLETED;
  }

  getNextStates(): JobStatus[] {
    return [JobStatus.COMPLETED];
  }

  async onEnter(job: JobLike): Promise<void> {
    Logger.getInstance().info(`Job ${job._id} work started`);
  }

  async onExit(job: JobLike): Promise<void> {
    Logger.getInstance().info(`Job ${job._id} exiting IN_PROGRESS state`);
  }
}
