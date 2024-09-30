import mongoose, { Schema, models, model } from 'mongoose';

export interface IDeanProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  courseId?: mongoose.Schema.Types.ObjectId;
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
const schema = new Schema<IDeanProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
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

const DeanProfile = models.DeanProfile || model<IDeanProfile>('DeanProfile', schema);
export default DeanProfile;
