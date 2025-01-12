import mongoose, { Schema, models, model } from 'mongoose';

export interface IReportGrade extends Document {
  category: string;
  userId: mongoose.Schema.Types.ObjectId;
  teacherId: mongoose.Schema.Types.ObjectId;
  deanId: mongoose.Schema.Types.ObjectId;
  teacherScheduleId: mongoose.Schema.Types.ObjectId;
  type: string;
  reportedGrade: any;
  scholarType: string;
  statusInDean: 'Pending' | 'Approved' | 'Declined';
  evaluated: boolean;

  schoolYear: string;
  isTrash: boolean;
}
const schema = new Schema<IReportGrade>(
  {
    category: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherProfile',
    },
    deanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeanProfile',
    },
    teacherScheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherSchedule',
    },
    type: { type: String },
    reportedGrade: [
      {
        profileId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'StudentProfile',
        },
        grade: { type: String },
      },
    ],
    statusInDean: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
    },
    evaluated: { type: Boolean },
    schoolYear: { type: String },
    isTrash: { type: Boolean },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const ReportGrade = models.ReportGrade || model<IReportGrade>('ReportGrade', schema);
export default ReportGrade;
