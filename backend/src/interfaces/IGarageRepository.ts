import { IGarage } from '../models/Garage';

export interface IGarageRepository {
  findById(id: string): Promise<IGarage | null>;
  findAll(): Promise<IGarage[]>;
  create(data: Partial<IGarage>): Promise<IGarage>;
  update(id: string, data: Partial<IGarage>): Promise<IGarage | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
