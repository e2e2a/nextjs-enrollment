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

  schoolYear: string;
  enrollStatus?: string;
  isStudentProfile: string;
  studentStatus?: string;
  studentType?: 'Regular' | 'Non-Regular';
  scholarType: 'TWSP' | 'STEP' | 'PESFA' | 'UAQTEA' | 'None';
  studentSubjects: Number;
  enrollmentStatus: string;
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

    schoolYear: { type: String },
    enrollStatus: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Rejected', 'Enrolled', 'Failed', 'Completed'],
    },
    /**
     * added some new features
     * this wont be use on how we render or display about the form in continuing students
     * @todo
     */
    enrollmentStatus: {
      type: String,
      enum: ['Success', 'Failed'],
    },

    studentStatus: {
      type: String,
      default: 'New Student',
      enum: ['New Student', 'Continue', 'Transferee'],
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
        teacherScheduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'TeacherSchedule',
        },
        status: {
          type: String,
          enum: ['Approved', 'Suggested', 'Declined', 'Pending'],
        },
        request: {
          type: String,
          enum: ['add', 'drop', 'suggested'],
        },

        requestStatusInDean: {
          type: String,
          enum: ['Pending', 'Approved', 'Declined'],
        },
        requestStatusInRegistrar: {
          type: String,
          enum: ['Pending', 'Approved', 'Declined'],
        },
        requestStatus: {
          type: String,
          enum: ['Approved', 'Pending', 'Declined'],
        },
        profileId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'StudentProfile',
        },
        grade: { type: String },
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
