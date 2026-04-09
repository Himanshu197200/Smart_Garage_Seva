import { IServiceJobService } from '../interfaces/IServiceJobService';
import { IServiceJobRepository } from '../interfaces/IServiceJobRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IVehicleRepository } from '../interfaces/IVehicleRepository';
import { INotificationService } from '../interfaces/INotificationService';
import { IServiceJob } from '../models/ServiceJob';
import { UserRole } from '../models/User';
import { CreateServiceJobDTO } from '../dtos/CreateServiceJobDTO';
import { JobStatus } from '../patterns/state/JobState';
import { JobStateMachine } from '../patterns/state/JobStateMachine';
import { JobStatusSubject } from '../patterns/observer/JobStatusSubject';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/AppError';
import Logger from '../patterns/singleton/Logger';

export class ServiceJobService implements IServiceJobService {
  private jobRepository: IServiceJobRepository;
  private userRepository: IUserRepository;
  private vehicleRepository: IVehicleRepository;
  private notificationService: INotificationService;

  constructor(
    jobRepository: IServiceJobRepository,
    userRepository: IUserRepository,
    vehicleRepository: IVehicleRepository,
    notificationService: INotificationService
  ) {
    this.jobRepository = jobRepository;
    this.userRepository = userRepository;
    this.vehicleRepository = vehicleRepository;
    this.notificationService = notificationService;
  }

  async createJob(dto: CreateServiceJobDTO, customerId: string): Promise<IServiceJob> {
    const vehicle = await this.vehicleRepository.findById(dto.vehicleId);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }

    const job = await this.jobRepository.create({
      vehicleId: dto.vehicleId as any,
      garageId: dto.garageId as any,
      problemDescription: dto.problemDescription,
      status: JobStatus.CREATED
    });

    Logger.getInstance().info(`Service job created: ${job._id} for vehicle ${dto.vehicleId}`);
    return job;
  }

  async getJobById(id: string): Promise<IServiceJob> {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new NotFoundError('Service job');
    }
    return job;
  }

  async getJobsByRole(userId: string, role: string, garageId?: string): Promise<IServiceJob[]> {
    if (role === UserRole.CUSTOMER) {
      const vehicles = await this.vehicleRepository.findByOwner(userId);
      const allJobs: IServiceJob[] = [];
      for (const v of vehicles) {
        const jobs = await this.jobRepository.findByVehicle(v._id.toString());
        allJobs.push(...jobs);
      }
      return allJobs;
    }

    if (role === UserRole.MECHANIC) {
      return await this.jobRepository.findByMechanic(userId);
    }

    if (role === UserRole.ADMIN && garageId) {
      return await this.jobRepository.findByGarage(garageId);
    }

    return [];
  }

  async assignMechanic(jobId: string, mechanicId: string): Promise<IServiceJob> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Service job');
    }

    const mechanic = await this.userRepository.findById(mechanicId);
    if (!mechanic || mechanic.role !== UserRole.MECHANIC) {
      throw new ValidationError('Invalid mechanic ID');
    }

    if (!mechanic.isAvailable) {
      throw new ValidationError('Mechanic is not available');
    }

    const machine = JobStateMachine.getInstance();
    await machine.transition(job, JobStatus.ASSIGNED);

    job.assignedMechanicId = mechanic._id;
    await this.jobRepository.update(jobId, {
      assignedMechanicId: mechanic._id,
      status: JobStatus.ASSIGNED
    });

    await this.userRepository.update(mechanicId, { isAvailable: false });

    await JobStatusSubject.getInstance().notify('JOB_ASSIGNED', {
      mechanicId,
      jobId,
      vehicleNumber: '',
      problemDescription: job.problemDescription
    });

    Logger.getInstance().info(`Job ${jobId} assigned to mechanic ${mechanicId}`);
    return job;
  }

  async updateStatus(jobId: string, newStatus: JobStatus, userId: string, role: string): Promise<IServiceJob> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Service job');
    }

    if (role === UserRole.MECHANIC && job.assignedMechanicId?.toString() !== userId) {
      throw new ForbiddenError('You are not assigned to this job');
    }

    const machine = JobStateMachine.getInstance();
    await machine.transition(job, newStatus);
    await this.jobRepository.update(jobId, { status: newStatus });

    await JobStatusSubject.getInstance().notify('JOB_STATUS_CHANGED', {
      jobId,
      newStatus,
      customerId: '',
      message: `Job status updated to ${newStatus}`
    });

    if (newStatus === JobStatus.DELIVERED) {
      await this.userRepository.update(job.assignedMechanicId!.toString(), { isAvailable: true });
    }

    Logger.getInstance().info(`Job ${jobId} status updated to ${newStatus}`);
    return job;
  }

  async updateEstimate(jobId: string, estimate: number): Promise<IServiceJob> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Service job');
    }
    const updated = await this.jobRepository.update(jobId, { costEstimate: estimate });
    Logger.getInstance().info(`Job ${jobId} estimate set to Rs.${estimate}`);
    return updated!;
  }

  async deleteJob(id: string): Promise<void> {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new NotFoundError('Service job');
    }
    await this.jobRepository.delete(id);
    Logger.getInstance().info(`Job ${id} deleted`);
  }

  async getAvailableTransitions(jobId: string): Promise<JobStatus[]> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Service job');
    }
    return JobStateMachine.getInstance().getAvailableTransitions(job.status);
  }
}
