import mongoose, { Schema, models, model } from 'mongoose';

export interface ICourse extends Document {
  courseCode: string;
  name: string;
  imageUrl?: string;
  description: string;
}
const schema = new Schema<ICourse>(
  {
    // sectionId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Section',
    // },
    //change this title to Department
    courseCode: {
      type: String,
    },
    name: {
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
let Course: mongoose.Model<ICourse>;

try {
    Course = mongoose.model<ICourse>('Course');
} catch (error) {
    Course = mongoose.model<ICourse>('Course', schema);
}

export default Course;
// export const StudentProfiles = models.StudentProfiles || model('StudentProfiles', schema);
