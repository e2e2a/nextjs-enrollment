import mongoose, { Document, Schema, model, models } from "mongoose";

interface ISession extends Document {
  userId: Schema.Types.ObjectId;
  expires_at: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    unique: true,
  },
  expires_at: {
    type: Date,
    required: true,
  },
});

export const Session = models.Sessions || model("Sessions", sessionSchema);