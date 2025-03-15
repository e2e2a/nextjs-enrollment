import mongoose, { Schema, models, model } from 'mongoose';

export interface IBlockType extends Document {
  courseId: mongoose.Schema.Types.ObjectId;
  category: string;
  semester: string;
  year: string;
  section: string;
  blockSubjects: any;
  archive?: boolean;
  archiveBy?: mongoose.Schema.Types.ObjectId;
}

const schema = new Schema<IBlockType>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    category: { type: String },
    semester: { type: String },
    year: { type: String },
    section: { type: String },
    blockSubjects: [
      {
        teacherScheduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'TeacherSchedule',
        },
      },
    ],
    archive: { type: Boolean, default: false },
    archiveBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SuperAdminProfile',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const BlockType = models.BlockType || model<IBlockType>('BlockType', schema);
export default BlockType;
