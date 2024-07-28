import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  username: string;
  emailVerified: Date;
  imageUrl?: string;
  role: 'USER' | 'ADMIN';
  lastLogin?: Date;
  lastLogout?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    password: { type: String },
    emailVerified: { type: Date },
    imageUrl: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent OverwriteModelError

// let User: mongoose.Model<IUser>;

// try {
//   User = mongoose.model<IUser>('User');
// } catch (error) {
//   User = mongoose.model<IUser>('User', userSchema);
// }

// export default User;
export const User =  mongoose.models.User ||  mongoose.model('User', userSchema);
