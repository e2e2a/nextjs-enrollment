import mongoose, { Schema, models, model } from 'mongoose';

// Define the Subject interface to match the schema
export interface IBlockSubject {
  subjectId: mongoose.Schema.Types.ObjectId;
//   professorId: mongoose.Schema.Types.ObjectId;
  days: string[];
  startTime?: string;
  endTime?: string;
}
export interface IBlockType extends Document {
  courseId: mongoose.Schema.Types.ObjectId;
  category: string;
  semester: string;
  year: string;
  section: string;
  blockSubjects: IBlockSubject[];
}
const schema = new Schema<IBlockType>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    category: {
      type: String,
    },
    semester: {
      type: String,
    },
    year: {
      type: String,
    },
    section: {
      type: String,
    },
    blockSubjects: [
      {
        //remember this is not like this instead this will be a reference to the teacherSchedule
        teacherScheduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'TeacherSchedule',
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const BlockType = models.BlockType || model<IBlockType>('BlockType', schema);
export default BlockType;
