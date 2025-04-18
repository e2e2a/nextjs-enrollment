import mongoose, { Document, Schema, model, models } from 'mongoose';

interface IResetPassword extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  expires: Date;
}

const schema = new Schema<IResetPassword>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const ResetPassword = models.ResetPassword || model('ResetPassword', schema);
