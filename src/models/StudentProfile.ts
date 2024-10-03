import mongoose, { Schema, models, model } from 'mongoose';
import { boolean } from 'zod';

export interface IProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
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
  studentSemester?: string;
  studentStatus?: string;
  psaUrl: string;
  goodMoralUrl: string;
  reportCardUrl: string;

  primarySchoolName: string;
  primarySchoolYear: string;
  secondarySchoolName: string;
  secondarySchoolYear: string;
  seniorHighSchoolName: string;
  seniorHighSchoolYear: string;
  seniorHighSchoolStrand: string;

  FathersLastName: string;
  FathersFirstName: string;
  FathersMiddleName: string;
  FathersContact: string;
  MothersLastName: string;
  MothersFirstName: string;
  MothersMiddleName: string;
  MothersContact: string;

  photoUrl: string;
  enrollStatus?: 'Pending' | 'Continue' | 'Completed';
  studentType?: 'Regular' | 'Non-Regular';
  scholarType: string;
  imageUrl?: string;
  isVerified: boolean;

  payment: boolean;
  
  lastLogin?: Date;
  lastLogout?: Date;
}
const schema = new Schema<IProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
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
    studentYear: { type: String },
    studentSemester: { type: String },
    studentStatus: {
      type: String,
      default: 'New Student',
      enum: ['New Student', 'Continue', 'Completed'],
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
      enum: ['Pending', 'Enrolled', 'Completed'],
    },
    // printLimit: {
    //   type: Number,
    //   default: 0,
    // },
    psaUrl: { type: String },
    goodMoralUrl: { type: String },
    reportCardUrl: { type: String },
    photoUrl: { type: String },

    primarySchoolName: { type: String },
    primarySchoolYear: { type: String },
    secondarySchoolName: { type: String },
    secondarySchoolYear: { type: String },
    seniorHighSchoolName: { type: String },
    seniorHighSchoolYear: { type: String },
    seniorHighSchoolStrand: { type: String },

    FathersLastName: { type: String },
    FathersFirstName: { type: String },
    FathersMiddleName: { type: String },
    FathersContact: { type: String },
    MothersLastName: { type: String },
    MothersFirstName: { type: String },
    MothersMiddleName: { type: String },
    MothersContact: { type: String },

    imageUrl: { type: String },
    isVerified: { type: Boolean, default: false },

    payment: { type: Boolean },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const StudentProfile = models.StudentProfile || model<IProfile>('StudentProfile', schema);
export default StudentProfile;
