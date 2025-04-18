import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  username: string;
  emailVerified: Date;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'DEAN' | 'ACCOUNTING' | 'SUPER ADMIN';
  active: boolean;
  revoke: boolean;
  lastLogin?: Date;
  lastLogout?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    username: { type: String },
    password: { type: String },
    emailVerified: { type: Date },
    role: { type: String, enum: ['STUDENT', 'TEACHER', 'ADMIN', 'DEAN', 'ACCOUNTING', 'SUPER ADMIN'], default: 'STUDENT' },
    active: { type: Boolean, default: false},
    revoke: { type: Boolean, default: false},
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
