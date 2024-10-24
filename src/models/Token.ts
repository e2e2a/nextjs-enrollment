import { Schema, models, model } from 'mongoose';
export interface IIps {
    address: string;
  }
export interface IUser extends Document {
  userId: Schema.Types.ObjectId;
  emailToChange: string;
  token: string;
  code: string;
  tokenType: string;
  expires: Date;
  expiresCode: Date;
}
const schema = new Schema<IUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    emailToChange: {
        type: String
    },
    token: {
        type: String
    },
    code: {
        type: String
    },
    tokenType: {
        type: String
    },
    expires: {
        type: Date
    },
    expiresCode: {
        type: Date
    },
  },
  { versionKey: false, timestamps: true }
);
export const Token = models.Token || model('Token', schema);
