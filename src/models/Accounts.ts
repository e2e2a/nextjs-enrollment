import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  userId: any;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string;
  access_token: string;
  expires_at: Date;
  scope: string;
  id_token: string;
  session_state: string;
}

const userSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true,
    },
    type: { type: String },
    provider: { type: String },
    providerAccountId: { type: String },
    refresh_token: { type: String },
    access_token: { type: String },
    expires_at: { type: Date },
    scope: { type: String },
    id_token: { type: String },
    session_state: { type: String },
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent OverwriteModelError

let Accounts: mongoose.Model<IAccount>;

try {
  Accounts = mongoose.model<IAccount>('Accounts');
} catch (error) {
  Accounts = mongoose.model<IAccount>('Accounts', userSchema);
}

export default Accounts;
