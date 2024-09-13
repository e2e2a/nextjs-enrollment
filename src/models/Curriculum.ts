import mongoose, { Schema, models, model } from 'mongoose';

export interface ICurriculum extends Document {
  courseId: mongoose.Schema.Types.ObjectId;
  curriculum: any;
}
const schema = new Schema<ICurriculum>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    curriculum: [
      {
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
            subjectId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Subject',
            },
          },
        ],
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Curriculum = models.Curriculum || model<ICurriculum>('Curriculum', schema);
export default Curriculum;
