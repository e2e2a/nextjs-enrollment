import mongoose, { Schema, models, model } from 'mongoose';

export interface IStudentSchedule extends Document {
  category: string;
  studentId: mongoose.Schema.Types.ObjectId;
  enrollmentId: mongoose.Schema.Types.ObjectId;
  // blockTypeId: mongoose.Schema.Types.ObjectId;
  teacherScheduleId: mongoose.Schema.Types.ObjectId;
  grade: string;
}
const schema = new Schema<IStudentSchedule>(
  {
    category: { type: String },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
    },
    teacherScheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherSchedule',
    },
    grade: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const StudentSchedule = models.StudentSchedule || model<IStudentSchedule>('StudentSchedule', schema);
export default StudentSchedule;
