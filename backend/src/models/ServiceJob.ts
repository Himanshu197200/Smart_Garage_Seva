import mongoose, { Schema, Document, Types } from 'mongoose';
import { JobStatus } from '../patterns/state/JobState';

export interface IServiceJob extends Document {
  _id: Types.ObjectId;
  vehicleId: Types.ObjectId;
  garageId: Types.ObjectId;
  assignedMechanicId?: Types.ObjectId;
  status: JobStatus;
  problemDescription: string;
  costEstimate: number;
  finalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceJobSchema = new Schema<IServiceJob>({
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  garageId: {
    type: Schema.Types.ObjectId,
    ref: 'Garage',
    required: [true, 'Garage is required']
  },
  assignedMechanicId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: Object.values(JobStatus),
    default: JobStatus.CREATED
  },
  problemDescription: {
    type: String,
    required: [true, 'Problem description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  costEstimate: {
    type: Number,
    default: 0,
    min: [0, 'Cost cannot be negative']
  },
  finalCost: {
    type: Number,
    default: 0,
    min: [0, 'Cost cannot be negative']
  }
}, { timestamps: true });

ServiceJobSchema.index({ vehicleId: 1 });
ServiceJobSchema.index({ garageId: 1, status: 1 });
ServiceJobSchema.index({ assignedMechanicId: 1 });
ServiceJobSchema.index({ status: 1, createdAt: -1 });

export const ServiceJobModel = mongoose.model<IServiceJob>('ServiceJob', ServiceJobSchema);
