import { DatabaseSession } from 'lucia';
import mongoose, { Document, Schema, model, models } from 'mongoose';

interface IResetPassword extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  expires_at: Date;
}

const schema = new Schema<IResetPassword>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const ResetPassword = models.ResetPasswords || model('ResetPasswords', schema);
