import mongoose, { Schema, models, model } from 'mongoose';

export interface IReportGradeRecord extends Document {
  category: string;
  teacherId: mongoose.Schema.Types.ObjectId;
  deanId: mongoose.Schema.Types.ObjectId;
  course: string;
  blockType?: any;
  subject?: any;
  room?: any;
  days?: any;
  startTime?: any;
  endTime?: any;
  type: string;
  reportedGrade: any;
  scholarType: string;
  statusInDean: 'Pending' | 'Approved' | 'Declined';
  evaluated: boolean;

  schoolYear: string;
  isTrash: boolean;
}
const schema = new Schema<IReportGradeRecord>(
  {
    category: { type: String },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherProfile',
    },
    deanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeanProfile',
    },
    course: {
      name: { type: String },
      courseCode: { type: String },
    },
    blockType: {
      year: { type: String },
      semester: { type: String },
      section: { type: String },
    },
    subject: {
      fixedRateAmount: { type: String },
      preReq: { type: String },
      category: { type: String },
      subjectCode: { type: String },
      name: { type: String },
      lec: { type: String },
      lab: { type: String },
      unit: { type: String },
    },
    room: {
      roomName: { type: String },
    },
    days: {
      type: [String],
      default: [],
    },
    startTime: { type: String },
    endTime: { type: String },
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

const ReportGradeRecord = models.ReportGradeRecord || model<IReportGradeRecord>('ReportGradeRecord', schema);
export default ReportGradeRecord;
