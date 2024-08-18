import mongoose, { Schema, models, model } from 'mongoose';
import Course from './Course';
export interface IEnrollment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  profileId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  studentYear?: string;
  studentSemester?: string;
  onProcess: Boolean;
  step: Number;
  enrollStatus?: 'Pending' | 'Continue' | 'Completed';
  onAccepted?: 'Accepted' | 'Decline';
  studentType?: 'Regular' | 'Non-Regular';
  scholarType: 'TWSP' | 'STEP' | 'PESFA' | 'UAQTEA' | 'None';
}
const schema = new Schema<IEnrollment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    // sectionId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Section',
    // },
    studentYear: {
      type: String,
    },
    studentSemester: {
      type: String,
    },
    // isEnrolled: {
    //   type: Boolean,
    //   default: false,
    // },
    // isEnrolling: {
    //   type: Boolean,
    //   default: false,
    // },
    // isStudying: {
    //   type: Boolean,
    //   default: false,
    // },
    onProcess: { type: Boolean, default: false },
    step: { type: Number, default: 1 },
    enrollStatus: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Continue', 'Completed'],
    },
    onAccepted: { type: String, default: 'Accepted', enum: ['Accepted', 'Decline'] },
    studentType: {
      type: String,
      enum: ['Regular', 'Non-Regular'],
    },
    scholarType: {
      type: String,
      enum: ['TWSP', 'STEP', 'PESFA', 'UAQTEA', 'None'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
let Enrollment: mongoose.Model<IEnrollment>;

try {
  Enrollment = mongoose.model<IEnrollment>('Enrollment');
} catch (error) {
  Enrollment = mongoose.model<IEnrollment>('Enrollment', schema);
}

export default Enrollment;
// export const StudentProfiles = models.StudentProfiles || model('StudentProfiles', schema);
