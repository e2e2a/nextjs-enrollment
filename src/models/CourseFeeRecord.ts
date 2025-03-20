import mongoose, { Schema, models, model } from 'mongoose';

export interface ICourseFeeRecord extends Document {
  category?: string;
  course?: string;
  courseCode?: string;
  ratePerUnit: string;
  ratePerLab: string;
  departmentalFee: string;
  insuranceFee: string;
  ssgFee: string;
  cwtsOrNstpFee: string;
  ojtFee: string;
  year: string;
  semester: string;
  downPayment: string;
  regOrMiscWithOldAndNew: boolean;
  regOrMisc: any;
  regOrMiscNew: any;
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
    insuranceFee: { type: String },
    ojtFee: { type: String },
    year: { type: String },
    semester: { type: String },
    schoolYear: { type: String },
    regOrMiscWithOldAndNew: { type: Boolean, default: false },
    regOrMisc: [
      {
        type: { type: String },
        name: { type: String },
        amount: { type: String },
      },
    ],
    regOrMiscNew: [
      {
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
