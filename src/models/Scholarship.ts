import mongoose, { Schema, models, model } from 'mongoose';

export interface IScholarship extends Document {
  category?: string;
  userId: mongoose.Schema.Types.ObjectId;
  profileId: mongoose.Schema.Types.ObjectId;
  year: string;
  semester: string;
  name: string;
  type: string;
  amount: string;
  discountPercentage: string;
  exemptedFees: any;
  downPayment: string;
  regOrMisc: any;
}

const schema = new Schema<IScholarship>(
  {
    category: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    year: { type: String },
    semester: { type: String },
    name: { type: String },
    type: { type: String },
    amount: { type: String },
    discountPercentage: { type: String },
    exemptedFees: {
      type: [String],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Scholarship = models.Scholarship || model<IScholarship>('Scholarship', schema);

export default Scholarship;
