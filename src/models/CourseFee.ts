import mongoose, { Schema, models, model } from 'mongoose';

export interface ICourseFee extends Document {
  category?: string;
  courseId: mongoose.Schema.Types.ObjectId;
  ratePerUnit: string;
  ratePerLab: string;
  departmentalFee: string;
  ssgFee: string;
  cwtsOrNstpFee: string;
  downPayment: string;
  insuranceFee: string;
  year: string;
  schoolYear: string;
  ojtFee: string;
  regOrMiscWithOldAndNew: boolean;
  regOrMisc: any;
  regOrMiscNew: any;
}

const schema = new Schema<ICourseFee>(
  {
    category: { type: String },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    ratePerUnit: { type: String },
    ratePerLab: { type: String },
    departmentalFee: { type: String },
    ssgFee: { type: String },
    cwtsOrNstpFee: { type: String },
    downPayment: { type: String },
    insuranceFee: { type: String },
    ojtFee: { type: String },
    year: { type: String },
    schoolYear: { type: String },
    regOrMiscWithOldAndNew: { type: Boolean, default: false },
    regOrMisc: [
      {
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

const CourseFee = models.CourseFee || model<ICourseFee>('CourseFee', schema);

export default CourseFee;
