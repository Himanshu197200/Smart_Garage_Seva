import mongoose, { Schema, Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  MECHANIC = 'MECHANIC',
  CUSTOMER = 'CUSTOMER'
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: UserRole;
  skills: string[];
  isAvailable: boolean;
  garageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: [true, 'Role is required']
  },
  skills: [{ type: String, trim: true }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  garageId: {
    type: String
  }
}, { timestamps: true });

UserSchema.index({ garageId: 1, role: 1 });
UserSchema.index({ role: 1, isAvailable: 1 });

export const UserModel = mongoose.model<IUser>('User', UserSchema);
