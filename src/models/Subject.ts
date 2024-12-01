import mongoose, { Schema, models, model } from 'mongoose';

export interface ISubject extends Document {
  fixedRateAmount: string;
  preReq: string;
  category: string;
  subjectCode: string;
  name: string;
  lec?: string;
  lab?: string;
  unit?: string;
}
const schema = new Schema<ISubject>(
  {
    fixedRateAmount: { type: String },
    preReq: { type: String },
    category: { type: String },
    subjectCode: { type: String },
    name: { type: String },
    lec: { type: String },
    lab: { type: String },
    unit: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Subject = models.Subject || model<ISubject>('Subject', schema);
export default Subject;
