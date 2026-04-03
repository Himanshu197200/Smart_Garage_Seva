import Logger from '../singleton/Logger';

export interface ExternalVehicleData {
  reg_no: string;
  make: string;
  model_name: string;
  manufacture_year: number;
  odometer_reading: number;
  fuel_type: string;
  engine_cc: number;
}

export interface IVehicleData {
  registrationNumber: string;
  brand: string;
  modelName: string;
  year: number;
  currentMileage: number;
  fuelType?: string;
  engineCapacity?: number;
}

export class ExternalVehicleAdapter implements IVehicleData {
  private externalData: ExternalVehicleData;

  constructor(externalData: ExternalVehicleData) {
    this.externalData = externalData;
    Logger.getInstance().debug(`Adapting external vehicle data for: ${externalData.reg_no}`);
  }

  get registrationNumber(): string {
    return this.externalData.reg_no.toUpperCase().replace(/\s+/g, '');
  }

  get brand(): string {
    return this.externalData.make;
  }

  get modelName(): string {
    return this.externalData.model_name;
  }

  get year(): number {
    return this.externalData.manufacture_year;
  }

  get currentMileage(): number {
    return this.externalData.odometer_reading;
  }

  get fuelType(): string {
    return this.externalData.fuel_type;
  }

  get engineCapacity(): number {
    return this.externalData.engine_cc;
  }

  toJSON(): IVehicleData {
    return {
      registrationNumber: this.registrationNumber,
      brand: this.brand,
      modelName: this.modelName,
      year: this.year,
      currentMileage: this.currentMileage,
      fuelType: this.fuelType,
      engineCapacity: this.engineCapacity
    };
  }
}
