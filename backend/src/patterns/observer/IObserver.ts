export interface IObserver {
  update(event: string, data: any): Promise<void>;
}
