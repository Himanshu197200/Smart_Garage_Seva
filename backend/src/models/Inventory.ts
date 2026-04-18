import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInventory extends Document {
  _id: Types.ObjectId;
  garageId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  lowStockThreshold: number;
  lastUpdated: Date;
}

const InventorySchema = new Schema<IInventory>({
  garageId: {
    type: String,
    required: [true, 'Garage is required'],
    minlength: 6,
    maxlength: 6
  },
  partName: {
    type: String,
    required: [true, 'Part name is required'],
    trim: true
  },
  partNumber: {
    type: String,
    required: [true, 'Part number is required'],
    uppercase: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Price cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [0, 'Threshold cannot be negative']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

InventorySchema.index({ garageId: 1, partNumber: 1 }, { unique: true });
InventorySchema.index({ garageId: 1 });
InventorySchema.index({ quantity: 1, lowStockThreshold: 1 });

export const InventoryModel = mongoose.model<IInventory>('Inventory', InventorySchema);
