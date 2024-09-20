import mongoose, { Schema, models, model } from 'mongoose';

export interface IAdminProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  firstname?: string;
  middlename?: string;
  lastname: string;
  extensionName?: string;
  emailFbAcc?: string;
  contact?: string;
  sex?: string;
  civilStatus?: string;
  birthday?: Date;
  age?: Number;
  imageUrl?: string;
  isVerified: boolean;
}
const schema = new Schema<IAdminProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    firstname: { type: String },
    middlename: { type: String },
    lastname: { type: String },
    extensionName: { type: String },
    contact: { type: String },
    sex: { type: String },
    civilStatus: { type: String },
    birthday: { type: Date },
    age: { type: String },
    imageUrl: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const AdminProfile = models.AdminProfile || model<IAdminProfile>('AdminProfile', schema);
export default AdminProfile;
