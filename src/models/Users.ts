import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  username: string;
  emailVerified: Date;
  profilePictureUrl?: string;
  role: 'USER' | 'ADMIN';
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    password: { type: String },
    emailVerified: { type: Date },
    profilePictureUrl: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent OverwriteModelError

let Users: mongoose.Model<IUser>;

try {
  Users = mongoose.model<IUser>('Users');
} catch (error) {
  Users = mongoose.model<IUser>('Users', userSchema);
}

export default Users;
