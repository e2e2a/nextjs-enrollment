import mongoose, { Schema, models, model } from 'mongoose';

export interface ISubject extends Document {
  fixedRateAmount: string;
  preReq: string;
  category: string;
  courseId?: mongoose.Schema.Types.ObjectId;
  subjectCode: string;
  name: string;
  lec?: string;
  lab?: string;
  unit?: string;
  archive?: boolean;
  archiveBy?: mongoose.Schema.Types.ObjectId;
}

const schema = new Schema<ISubject>(
  {
    fixedRateAmount: { type: String },
    preReq: { type: String },
    category: { type: String },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    subjectCode: { type: String },
    name: { type: String },
    lec: { type: String },
    lab: { type: String },
    unit: { type: String },
    archive: { type: Boolean, default: false },
    archiveBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeanProfile',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Subject = models.Subject || model<ISubject>('Subject', schema);
export default Subject;
