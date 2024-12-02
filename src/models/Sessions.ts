import mongoose, { Document, Schema, model, models } from 'mongoose';

interface ISession extends Document {
  sessionToken: string; // Unique session token
  userId: Schema.Types.ObjectId; // Reference to the User
  expires: Date; // Session expiration time
}

const sessionSchema = new Schema<ISession>({
  sessionToken: { type: String },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  expires: { type: Date },
});

// Export the Session model
export const Session = models.Session || model('Session', sessionSchema);
