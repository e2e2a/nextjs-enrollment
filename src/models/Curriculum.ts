import mongoose, { Schema, models, model } from 'mongoose';

export interface ICurriculum extends Document {
  category: string;
  courseId: mongoose.Schema.Types.ObjectId;
  curriculum: any;
}

const curriculumSchema = new Schema(
  {
    year: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    order: { type: Number },
    subjectsFormat: [
      {
        order: { type: Number },
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
      },
    ],
  },
  { _id: true } // Enable _id for subdocuments
);

const schema = new Schema<ICurriculum>(
  {
    category: { type: String },
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

const Curriculum = models.Curriculum || model<ICurriculum>('Curriculum', schema);
export default Curriculum;
