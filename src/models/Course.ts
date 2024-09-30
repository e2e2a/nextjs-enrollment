import mongoose, { Schema, models, model } from 'mongoose';

export interface ICourse extends Document {
  category?: string;
  courseCode: string;
  grade?: string;
  name: string;
  courseType: string;
  imageUrl?: string;
  description: string;
}
const schema = new Schema<ICourse>(
  {
    // sectionId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Section',
    // },
    category: {
      type: String,
    },
    //change this title to Department
    courseCode: {
      type: String,
    },
    /**
     * @todo
     * grade will be used in jhs
     * no name
     * no coursecode
     * no courseType
     */
    grade: {
      type: String,
    },
    name: {
      type: String,
    },
    courseType: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Course = models.Course || model<ICourse>('Course', schema);

export default Course;
