import mongoose, { Schema, models, model } from 'mongoose';

export interface IEnrollmentRecord extends Document {
  category: string;
  profileId: mongoose.Schema.Types.ObjectId;

  course: string;
  blockType: string;
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
    category: { type: String },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    course: { type: String },
    blockType: {
      year: {
        type: String,
      },
      semester: {
        type: String,
      },
      section: {
        type: String,
      },
    },

    studentType:{ type: String },
    studentYear: { type: String },
    studentSemester: { type: String },
    step: { type: Number, default: 1 },
    schoolYear: { type: String },

    enrollStatus: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Rejected', 'Enrolled', 'Failed', 'Completed'],
    },
    
    enrollmentStatus: {
      type: String,
      enum: ['Success', 'Failed'],
    },

    studentStatus: {
      type: String,
      default: 'New Student',
      enum: ['New Student', 'Continue', 'Transferee'],
    },

    
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
          middlename: {
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
        blockType:{
          year: {
            type: String,
          },
          semester: {
            type: String,
          },
          section: {
            type: String,
          },
        },
        days: {
          type: [String],
          default: [],
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
        room: {
          roomName: {
            type: String,
          },
        },
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
let EnrollmentRecord: mongoose.Model<IEnrollmentRecord>;

try {
  EnrollmentRecord = mongoose.model<IEnrollmentRecord>('EnrollmentRecord');
} catch (error) {
  EnrollmentRecord = mongoose.model<IEnrollmentRecord>('EnrollmentRecord', schema);
}

export default EnrollmentRecord;
