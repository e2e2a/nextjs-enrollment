import mongoose, { Schema, models, model } from 'mongoose';

export interface ITeacherSchedule extends Document {
  category: string;
  profileId: mongoose.Schema.Types.ObjectId;
  schedule?: any;
}
const schema = new Schema<ITeacherSchedule>(
  {
    category: { type: String },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherProfile',
    },
    schedule: [
      {
        // this sectionId will be used to compare which section and subject to compare with students
        // this will only added when its being selected in the list of schedules to add in the section
        blockTypeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'BlockType',
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
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const TeacherSchedule = models.TeacherSchedule || model<ITeacherSchedule>('TeacherSchedule', schema);
export default TeacherSchedule;
