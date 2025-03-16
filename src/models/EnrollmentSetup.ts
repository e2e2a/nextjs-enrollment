import mongoose, { Schema, models, model } from 'mongoose';

export interface IEnrollmentSetup extends Document {
  name?: string;
  enrollmentTertiary: any;
  studentYear?: string;
  openWithdraw?: boolean;
  addOrDropSubjects?: boolean;
}

const schema = new Schema<IEnrollmentSetup>(
  {
    name: { type: String },
    enrollmentTertiary: {
      open: { type: Boolean },
      firstGrade: { open: { type: Boolean, default: false } },
      secondGrade: { open: { type: Boolean, default: false } },
      thirdGrade: { open: { type: Boolean, default: false } },
      fourthGrade: { open: { type: Boolean, default: false } },
      schoolYear: { type: String },
      semester: { type: String },
    },

    openWithdraw: { type: Boolean, default: false },
    addOrDropSubjects: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const EnrollmentSetup = models.EnrollmentSetup || model<IEnrollmentSetup>('EnrollmentSetup', schema);
export default EnrollmentSetup;
