import mongoose, { Schema, models, model } from 'mongoose';

export interface ISubject extends Document {
  subjectCode: string;
  name: string;
  unit: string;
  category: string;
  description: string; 
}
const schema = new Schema<ISubject>(
  {
    subjectCode: {
      type: String,
    },
    name: {
      type: String,
    },
    unit: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Subject = models.Subject || model<ISubject>('Subject', schema);
export default Subject;
