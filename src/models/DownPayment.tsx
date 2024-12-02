import mongoose, { Schema, models, model } from 'mongoose';

export interface IDownPayment extends Document {
  category?: string;
  courseId: mongoose.Schema.Types.ObjectId;
  defaultPayment: string;
}
const schema = new Schema<IDownPayment>(
  {
    category: { type: String },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    defaultPayment: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const DownPayment = models.DownPayment || model<IDownPayment>('DownPayment', schema);

export default DownPayment;
