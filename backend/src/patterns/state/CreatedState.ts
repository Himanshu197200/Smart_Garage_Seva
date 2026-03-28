import { IJobState, JobStatus, JobLike } from './JobState';
import Logger from '../singleton/Logger';

export class CreatedState implements IJobState {
  getName(): JobStatus {
    return JobStatus.CREATED;
  }

  canTransitionTo(state: JobStatus): boolean {
    return state === JobStatus.ASSIGNED;
  }

  getNextStates(): JobStatus[] {
    return [JobStatus.ASSIGNED];
  }

  async onEnter(job: JobLike): Promise<void> {
    Logger.getInstance().info(`Job ${job._id} entered CREATED state`);
  }

  async onExit(job: JobLike): Promise<void> {
    Logger.getInstance().info(`Job ${job._id} exiting CREATED state`);
  }
}
