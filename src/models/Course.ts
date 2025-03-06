import mongoose, { Schema, models, model } from 'mongoose';

export interface ICourse extends Document {
  category?: string;
  courseCode: string;
  grade?: string;
  name: string;
  courseType: string;
  imageUrl?: string;
  description: string;
  archive?: boolean;
  archiveBy?: mongoose.Schema.Types.ObjectId;
}

const schema = new Schema<ICourse>(
  {
    category: { type: String },
    courseCode: { type: String },
    grade: { type: String },
    name: { type: String },
    courseType: { type: String },
    imageUrl: { type: String },
    description: { type: String },
    archive: { type: Boolean, default: false },
    archiveBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminProfile',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Course = models.Course || model<ICourse>('Course', schema);

export default Course;
