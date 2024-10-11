import mongoose, { Schema, models, model } from 'mongoose';

export interface IEnrollmentRecord extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  profileId: mongoose.Schema.Types.ObjectId;

  courseId: string;
  blockTypeId: string;
  student: any;
  studentYear?: string;
  studentSemester?: string;
  onProcess: Boolean;
  step: Number;

  schoolYear: string;
  enrollStatus?: string;
  isStudentProfile: string;
  studentStatus?: string;
  studentType?: string;
  scholarType: 'TWSP' | 'STEP' | 'PESFA' | 'UAQTEA' | 'None';
  studentSubjects: Number;
  enrollmentStatus: string;
}

const schema = new Schema<IEnrollmentRecord>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    student: {
      firstname: {
        type: String,
      },
      middleName: {
        type: String,
      },
      lastname: {
        type: String,
      },
      extensionName: {
        type: String,
      },
      sex: {
        type: String,
      },
    },
    courseId: { type: String },
    blockTypeId: { type: String },

    studentYear: {
      type: String,
    },
    studentSemester: {
      type: String,
    },

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

    studentType: { type: String },
    scholarType: {
      type: String,
      enum: ['TWSP', 'STEP', 'PESFA', 'UAQTEA', 'None'],
    },
    studentSubjects: [
      {
        subject: {
          fixedRateAmount: {
            type: String,
          },
          preReq: {
            type: String,
          },
          category: {
            type: String,
          },
          subjectCode: {
            type: String,
          },
          name: {
            type: String,
          },
          lec: {
            type: String,
          },
          lab: {
            type: String,
          },
          unit: {
            type: String,
          },
        },
        teacher: {
          firstname: {
            type: String,
          },
          middleName: {
            type: String,
          },
          lastname: {
            type: String,
          },
          extensionName: {
            type: String,
          },
          sex: {
            type: String,
          },
        },
        // teacherScheduleId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: 'TeacherSchedule',
        // },
        status: {
          type: String,
          enum: ['Approved', 'Suggested', 'Declined', 'Pending', 'Dropped'],
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
          enum: ['Approved', 'Pending', 'Suggested', 'Declined'],
        },
        //change profileId to this
        student: {
          firstname: {
            type: String,
          },
          middleName: {
            type: String,
          },
          lastname: {
            type: String,
          },
          extensionName: {
            type: String,
          },
          sex: {
            type: String,
          },
        },
        // profileId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: 'StudentProfile',
        // },
        grade: { type: String },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
let EnrollmentRecord: mongoose.Model<IEnrollmentRecord>;

try {
  EnrollmentRecord = mongoose.model<IEnrollmentRecord>('EnrollmentRecord');
} catch (error) {
  EnrollmentRecord = mongoose.model<IEnrollmentRecord>('EnrollmentRecord', schema);
}

export default EnrollmentRecord;
