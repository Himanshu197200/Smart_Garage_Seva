import { IJobState, JobStatus, JobLike } from './JobState';
import Logger from '../singleton/Logger';

export class AssignedState implements IJobState {
  getName(): JobStatus {
    return JobStatus.ASSIGNED;
  }

  canTransitionTo(state: JobStatus): boolean {
    return state === JobStatus.IN_PROGRESS;
  }

  getNextStates(): JobStatus[] {
    return [JobStatus.IN_PROGRESS];
  }

  async onEnter(job: JobLike): Promise<void> {
    Logger.getInstance().info(`Job ${job._id} assigned to mechanic ${job.assignedMechanicId}`);
  }

  async onExit(job: JobLike): Promise<void> {
    Logger.getInstance().info(`Job ${job._id} exiting ASSIGNED state`);
  }
}
