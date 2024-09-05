import mongoose, { Schema, models, model } from 'mongoose';

export interface ITeacherProfile extends Document {
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
  lastLogin?: Date;
  lastLogout?: Date;
}
const schema = new Schema<ITeacherProfile>(
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
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const TeacherProfile = models.TeacherProfile || model<ITeacherProfile>('TeacherProfile', schema);
export default TeacherProfile;
