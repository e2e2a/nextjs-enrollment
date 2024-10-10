import mongoose, { Schema, models, model } from 'mongoose';

export interface IEnrollmentSetup extends Document {
  name?: string;
  enrollmentTertiary: any;
  studentYear?: string;
  addOrDropSubjects?: boolean;
}

const schema = new Schema<IEnrollmentSetup>(
  {
    name: {
      type: String,
    },
    enrollmentTertiary: {
      open: {
        type: Boolean,
      },
      schoolYear: {
        type: String,
      },
      semester: {
        type: String,
      },
    },

    addOrDropSubjects: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const EnrollmentSetup = models.EnrollmentSetup || model<IEnrollmentSetup>('EnrollmentSetup', schema);
export default EnrollmentSetup;
