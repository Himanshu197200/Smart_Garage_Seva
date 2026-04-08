import { BaseRepository } from './BaseRepository';
import { IGarage, GarageModel } from '../models/Garage';
import { IGarageRepository } from '../interfaces/IGarageRepository';

export class GarageRepository extends BaseRepository<IGarage> implements IGarageRepository {
  constructor() {
    super(GarageModel);
  }
}
