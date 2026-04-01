import { IObserver } from './IObserver';

export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(event: string, data: any): Promise<void>;
}
