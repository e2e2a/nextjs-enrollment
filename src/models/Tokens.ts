import { Schema, models, model } from 'mongoose';
export interface IIps {
    address: string;
  }
export interface IUser extends Document {
  userId: Schema.Types.ObjectId;
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
      ref: 'Users',
      required: true,
      unique: true,
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
export const Token = models.Tokens || model('Tokens', schema);
