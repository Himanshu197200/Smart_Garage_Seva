import mongoose, { Schema, Document, Types } from 'mongoose';
import { NotificationType } from '../patterns/factory/NotificationFactory';

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: [true, 'Notification type is required']
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);
