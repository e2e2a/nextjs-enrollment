import mongoose, { Schema, models, model } from 'mongoose';

export interface IEnrollment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  studentYear?: string;
  semester?: string;
  enrollStatus?: 'Pending' | 'Continue' | 'Completed';
  studentType?: 'Regular' | 'Non-Regular';
  scholarType: string;
}
const schema = new Schema<IEnrollment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    semester: {
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
    enrollStatus: {
      type: String,
      enum: ['Pending', 'Continue', 'Completed'],
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
