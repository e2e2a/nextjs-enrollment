import mongoose, { Schema, models, model } from 'mongoose';

export interface ISchoolYear extends Document {
  schoolYear: string;
  isEnable: boolean;
}
const schema = new Schema<ISchoolYear>(
  {
    // sectionId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Section',
    // },
    schoolYear: {
      type: String,
    },
    isEnable: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const SchoolYear = models.SchoolYear || model<ISchoolYear>('SchoolYear', schema);

export default SchoolYear;
