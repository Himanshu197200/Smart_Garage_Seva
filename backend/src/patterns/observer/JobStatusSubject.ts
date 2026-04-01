import { ISubject } from './ISubject';
import { IObserver } from './IObserver';
import Logger from '../singleton/Logger';

export class JobStatusSubject implements ISubject {
  private observers: IObserver[] = [];
  private static instance: JobStatusSubject;

  private constructor() {}

  public static getInstance(): JobStatusSubject {
    if (!JobStatusSubject.instance) {
      JobStatusSubject.instance = new JobStatusSubject();
    }
    return JobStatusSubject.instance;
  }

  public attach(observer: IObserver): void {
    if (this.observers.includes(observer)) {
      Logger.getInstance().warn('Observer already attached');
      return;
    }
    this.observers.push(observer);
    Logger.getInstance().info('Observer attached to JobStatusSubject');
  }

  public detach(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      Logger.getInstance().warn('Observer not found');
      return;
    }
    this.observers.splice(index, 1);
    Logger.getInstance().info('Observer detached from JobStatusSubject');
  }

  public async notify(event: string, data: any): Promise<void> {
    Logger.getInstance().info(`Notifying ${this.observers.length} observers about: ${event}`);
    for (const observer of this.observers) {
      try {
        await observer.update(event, data);
      } catch (error) {
        Logger.getInstance().error(`Error notifying observer: ${error}`);
      }
    }
  }
}
