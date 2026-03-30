import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJobPartUsage extends Document {
  _id: Types.ObjectId;
  serviceJobId: Types.ObjectId;
  inventoryId: Types.ObjectId;
  quantityUsed: number;
  createdAt: Date;
}

const JobPartUsageSchema = new Schema<IJobPartUsage>({
  serviceJobId: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceJob',
    required: [true, 'Service job is required']
  },
  inventoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Inventory',
    required: [true, 'Inventory item is required']
  },
  quantityUsed: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  }
}, { timestamps: true });

JobPartUsageSchema.index({ serviceJobId: 1 });
JobPartUsageSchema.index({ inventoryId: 1 });

export const JobPartUsageModel = mongoose.model<IJobPartUsage>('JobPartUsage', JobPartUsageSchema);
