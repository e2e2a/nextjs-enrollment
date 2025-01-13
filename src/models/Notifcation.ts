import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  to: mongoose.Schema.Types.ObjectId;
  from: mongoose.Schema.Types.ObjectId;
  title: string;
  link?: string;
  type: 'FRESH' | 'OLD';
}

const notificationSchema = new Schema<INotification>(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: { type: String },
    link: { type: String },
    type: { type: String, enum: ['FRESH', 'OLD'], default: 'FRESH' },
  },
  { timestamps: true }
);

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
