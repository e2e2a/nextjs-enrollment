import mongoose, { Schema, models, model } from 'mongoose';

export interface IEnrollment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  profileId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  blockTypeId: mongoose.Schema.Types.ObjectId;
  studentYear?: string;
  studentSemester?: string;
  onProcess: Boolean;
  step: Number;
  psaUrl: string;
  photoUrl: string;
  pdfUrl: string;
  schoolYear: string;
  enrollStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Enrolled';
  isStudentProfile: string;
  studentStatus?: 'New Student' | 'Continued' | 'Completed';
  studentType?: 'Regular' | 'Non-Regular';
  scholarType: 'TWSP' | 'STEP' | 'PESFA' | 'UAQTEA' | 'None';
  studentSubjects: Number;
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
    blockTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlockType',
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
    psaUrl: { type: String },
    photoUrl: {
      type: String,
    },
    pdfUrl: {
      type: String,
    },
    schoolYear: {
      type: String,
    },
    enrollStatus: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Approved', 'Rejected', 'Enrolled'],
    },
    studentStatus: {
      type: String,
      default: 'New Student',
      enum: ['New Student', 'Continue', 'Completed'],
    },
    // onAccepted: { type: String, default: 'Accepted', enum: ['Accepted', 'Decline'] },

    isStudentProfile: {
      type: String,
    },
    studentType: {
      type: String,
      enum: ['Regular', 'Non-Regular'],
    },
    scholarType: {
      type: String,
      enum: ['TWSP', 'STEP', 'PESFA', 'UAQTEA', 'None'],
    },
    studentSubjects: [
      {
        //remember this is not like this instead this will be a reference to the teacherSchedule
        teacherScheduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'TeacherSchedule',
        },
        // studentScheduleId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: 'StudentSchedule',
        // },
        profileId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'StudentProfile',
        },
        grade: {type: String}
      },
    ],
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
