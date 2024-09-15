import mongoose, { Schema, models, model } from 'mongoose';

export interface IStudentSchedule extends Document {
  category: string;
  studentId: mongoose.Schema.Types.ObjectId;
  blockTypeId: mongoose.Schema.Types.ObjectId;
  schedule?: any;
}
const schema = new Schema<IStudentSchedule>(
  {
    category: { type: String },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    blockTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlockType',
    },
    schedule: [
      {
        teacherScheduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'TeacherSchedule',
        },
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        roomId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Room',
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
        grade: {
          type: String,
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const StudentSchedule = models.StudentSchedule || model<IStudentSchedule>('StudentSchedule', schema);
export default StudentSchedule;
