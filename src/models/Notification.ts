import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface INotification extends Document {
  to: mongoose.Schema.Types.ObjectId;
  from: mongoose.Schema.Types.ObjectId;
  role?: string;
  title: string;
  link?: string;
  type: 'FRESH' | 'OLD';
}

const schema = new Schema<INotification>(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: { type: String },
    title: { type: String },
    link: { type: String },
    type: { type: String, enum: ['FRESH', 'OLD'], default: 'FRESH' },
  },
  { timestamps: true }
);

const Notification = models.Notification || model<INotification>('Notification', schema);
export default Notification;
