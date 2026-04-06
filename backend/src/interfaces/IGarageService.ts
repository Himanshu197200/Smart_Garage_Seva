import { IGarage } from '../models/Garage';

export interface IGarageService {
  createGarage(data: Partial<IGarage>): Promise<IGarage>;
  getGarageById(id: string): Promise<IGarage>;
  getAllGarages(): Promise<IGarage[]>;
  updateGarage(id: string, data: Partial<IGarage>): Promise<IGarage>;
  deleteGarage(id: string): Promise<void>;
}
