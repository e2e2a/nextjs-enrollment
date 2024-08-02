import mongoose, { Schema, models, model } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  firstname?: string;
  middlename?: string;
  lastname: string;
  extensionName?: string;
  numberStreet?: string;
  barangay?: string;
  district?: string;
  cityMunicipality?: string;
  province?: string;
  region?: string;
  emailFbAcc?: string;
  contact?: string;
  nationality?: string;
  sex?: string;
  civilStatus?: string;
  employmentStatus?: string;
  birthday?: Date;
  age?: Number;
  birthPlaceCity?: string;
  birthPlaceProvince?: string;
  birthPlaceRegion?: string;
  educationAttainment?: string;
  learnerOrTraineeOrStudentClassification?: string;
  studentYear?: string;
  semester?: string;
  enrollStatus?: 'Pending' | 'Continue' | 'Completed';
  studentType?: 'Regular' | 'Non-Regular';
  scholarType: string;
  isVerified: boolean;
  lastLogin?: Date;
  lastLogout?: Date;
}
const schema = new Schema<IProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // courseId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Course',
    // },
    // sectionId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Section',
    // },
    firstname: { type: String },
    middlename: { type: String },
    lastname: { type: String },
    extensionName: { type: String },
    numberStreet: { type: String },
    barangay: { type: String },
    district: { type: String },
    cityMunicipality: { type: String },
    province: { type: String },
    region: { type: String },
    emailFbAcc: { type: String },
    contact: { type: String },
    nationality: { type: String },
    sex: { type: String },
    civilStatus: { type: String },
    employmentStatus: { type: String },
    birthday: { type: Date },
    age: { type: String },
    birthPlaceCity: { type: String },
    birthPlaceProvince: { type: String },
    birthPlaceRegion: { type: String },
    educationAttainment: { type: String },
    learnerOrTraineeOrStudentClassification: { type: String },
    // takenNcaeOrYp4sc: {
    //   type: String,
    // },
    studentYear: {
      type: String,
    },
    semester: {
      type: String,
    },
    // isEnrolled: {
    //   type: Boolean,
    //   default: false,
    // },
    // isEnrolling: {
    //   type: Boolean,
    //   default: false,
    // },
    // isStudying: {
    //   type: Boolean,
    //   default: false,
    // },
    enrollStatus: {
      type: String,
      enum: ['Pending', 'Continue', 'Completed'],
    },
    // printLimit: {
    //   type: Number,
    //   default: 0,
    // },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
let StudentProfile: mongoose.Model<IProfile>;

try {
  StudentProfile = mongoose.model<IProfile>('StudentProfile');
} catch (error) {
  StudentProfile = mongoose.model<IProfile>('StudentProfile', schema);
}

export default StudentProfile;
// export const StudentProfiles = models.StudentProfiles || model('StudentProfiles', schema);
