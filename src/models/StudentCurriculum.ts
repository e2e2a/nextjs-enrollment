import mongoose, { Schema, models, model } from 'mongoose';

export interface IStudentCurriculum extends Document {
  category: string;
  studentId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  curriculum: any;
}
const curriculumSchema = new Schema(
  {
    schoolYear: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
    },
    subjectsFormat: [
      {
        order: {
          type: Number,
        },
        grade: {
          type: String,
        },
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
      },
    ],
  },
  { _id: true } // Enable _id for subdocuments
);
const schema = new Schema<IStudentCurriculum>(
  {
    category: { type: String },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    curriculum: [curriculumSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const StudentCurriculum = models.StudentCurriculum || model<IStudentCurriculum>('StudentCurriculum', schema);
export default StudentCurriculum;
