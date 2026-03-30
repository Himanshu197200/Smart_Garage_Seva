import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGarage extends Document {
  _id: Types.ObjectId;
  name: string;
  address: string;
  contactNumber: string;
  workingHours: string;
  createdAt: Date;
  updatedAt: Date;
}

const GarageSchema = new Schema<IGarage>({
  name: {
    type: String,
    required: [true, 'Garage name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  workingHours: {
    type: String,
    default: '9:00 AM - 6:00 PM'
  }
}, { timestamps: true });

export const GarageModel = mongoose.model<IGarage>('Garage', GarageSchema);
