import mongoose, { Schema, models, model } from 'mongoose';

export interface ICourseFeeRecord extends Document {
  category?: string;
  course?: string;
  courseCode?: string;
  ratePerUnit: string;
  ratePerLab: string;
  departmentalFee: string;
  ssgFee: string;
  cwtsOrNstpFee: string;
  year: string;
  semester: string;
  downPayment: string;
  regOrMisc: any;
  schoolYear: any;
}

const schema = new Schema<ICourseFeeRecord>(
  {
    category: { type: String },
    course: { type: String },
    courseCode: { type: String },
    ratePerUnit: { type: String },
    ratePerLab: { type: String },
    departmentalFee: { type: String },
    ssgFee: { type: String },
    cwtsOrNstpFee: { type: String },
    downPayment: { type: String },
    year: { type: String },
    semester: { type: String },
    schoolYear: { type: String },
    regOrMisc: [
      {
        type: { type: String },
        name: { type: String },
        amount: { type: String },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CourseFeeRecord = models.CourseFeeRecord || model<ICourseFeeRecord>('CourseFeeRecord', schema);

export default CourseFeeRecord;
