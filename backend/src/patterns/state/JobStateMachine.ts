import { IJobState, JobStatus, JobLike } from './JobState';
import { CreatedState } from './CreatedState';
import { AssignedState } from './AssignedState';
import { InProgressState } from './InProgressState';
import { CompletedState } from './CompletedState';
import { DeliveredState } from './DeliveredState';
import { AppError } from '../../utils/AppError';
import Logger from '../singleton/Logger';

export class JobStateMachine {
  private states: Map<JobStatus, IJobState>;
  private static instance: JobStateMachine;

  private constructor() {
    this.states = new Map<JobStatus, IJobState>([
      [JobStatus.CREATED, new CreatedState()],
      [JobStatus.ASSIGNED, new AssignedState()],
      [JobStatus.IN_PROGRESS, new InProgressState()],
      [JobStatus.COMPLETED, new CompletedState()],
      [JobStatus.DELIVERED, new DeliveredState()]
    ]);
  }

  public static getInstance(): JobStateMachine {
    if (!JobStateMachine.instance) {
      JobStateMachine.instance = new JobStateMachine();
    }
    return JobStateMachine.instance;
  }

  public getState(status: JobStatus): IJobState | undefined {
    return this.states.get(status);
  }

  public async transition(job: JobLike, newStatus: JobStatus): Promise<void> {
    const currentState = this.states.get(job.status);

    if (!currentState) {
      throw new AppError(`Unknown current state: ${job.status}`, 400);
    }

    if (!currentState.canTransitionTo(newStatus)) {
      throw new AppError(
        `Cannot transition from ${job.status} to ${newStatus}. Allowed: ${currentState.getNextStates().join(', ')}`,
        400
      );
    }

    Logger.getInstance().info(`Job ${job._id}: ${job.status} -> ${newStatus}`);

    await currentState.onExit(job);
    const previousStatus = job.status;
    job.status = newStatus;
    const newState = this.states.get(newStatus);
    if (newState) {
      await newState.onEnter(job);
    }

    Logger.getInstance().info(`Job ${job._id}: transitioned from ${previousStatus} to ${newStatus}`);
  }

  public getAvailableTransitions(currentStatus: JobStatus): JobStatus[] {
    const state = this.states.get(currentStatus);
    return state ? state.getNextStates() : [];
  }

  public isValidTransition(from: JobStatus, to: JobStatus): boolean {
    const state = this.states.get(from);
    return state ? state.canTransitionTo(to) : false;
  }
}
