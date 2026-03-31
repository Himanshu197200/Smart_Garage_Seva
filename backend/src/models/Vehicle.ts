import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVehicle extends Document {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  garageId: Types.ObjectId;
  registrationNumber: string;
  brand: string;
  modelName: string;
  year: number;
  currentMileage: number;
  lastServiceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  garageId: {
    type: Schema.Types.ObjectId,
    ref: 'Garage',
    required: [true, 'Garage is required']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  modelName: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  currentMileage: {
    type: Number,
    default: 0,
    min: [0, 'Mileage cannot be negative']
  },
  lastServiceDate: { type: Date }
}, { timestamps: true });

VehicleSchema.index({ ownerId: 1 });
VehicleSchema.index({ garageId: 1 });

export const VehicleModel = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
