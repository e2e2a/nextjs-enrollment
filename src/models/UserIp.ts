import { Schema, models, model } from 'mongoose';
export interface IIps {
    address: string;
  }
export interface IUser extends Document {
  userId: Schema.Types.ObjectId;
  ips: IIps[]
}
const schema = new Schema<IUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true,
    },
    ips: [
      {
        address: {
          type: [String],
          default: [],
        },
      },
      { versionKey: false, timestamps: true }
    ],
  },
  { versionKey: false, timestamps: true }
);
export const UserIp = models.UserIps || model('UserIps', schema);
