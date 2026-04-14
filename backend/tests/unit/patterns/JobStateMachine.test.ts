import { JobStateMachine } from '../../../src/patterns/state/JobStateMachine';
import { JobStatus } from '../../../src/patterns/state/JobState';

describe('JobStateMachine', () => {
  let machine: JobStateMachine;

  beforeEach(() => {
    machine = JobStateMachine.getInstance();
  });

  it('should return the singleton instance', () => {
    const instance1 = JobStateMachine.getInstance();
    const instance2 = JobStateMachine.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should transition from CREATED to ASSIGNED', async () => {
    const job: any = { _id: 'job1', status: JobStatus.CREATED, assignedMechanicId: 'mech1' };
    await machine.transition(job, JobStatus.ASSIGNED);
    expect(job.status).toBe(JobStatus.ASSIGNED);
  });

  it('should reject invalid transition from CREATED to COMPLETED', async () => {
    const job: any = { _id: 'job1', status: JobStatus.CREATED };
    await expect(machine.transition(job, JobStatus.COMPLETED)).rejects.toThrow();
  });

  it('should return available transitions for ASSIGNED', () => {
    const transitions = machine.getAvailableTransitions(JobStatus.ASSIGNED);
    expect(transitions).toContain(JobStatus.IN_PROGRESS);
  });

  it('should return empty transitions for DELIVERED (terminal state)', () => {
    const transitions = machine.getAvailableTransitions(JobStatus.DELIVERED);
    expect(transitions).toHaveLength(0);
  });

  it('should validate transition correctly', () => {
    expect(machine.isValidTransition(JobStatus.CREATED, JobStatus.ASSIGNED)).toBe(true);
    expect(machine.isValidTransition(JobStatus.CREATED, JobStatus.DELIVERED)).toBe(false);
  });
});
