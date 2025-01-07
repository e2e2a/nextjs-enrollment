import mongoose, { Schema, models, model } from 'mongoose';

export interface ITeacherScheduleRecord extends Document {
  category: string;
  schoolYear: string;
  profileId: mongoose.Schema.Types.ObjectId;
  deanId: mongoose.Schema.Types.ObjectId;
  course: string;
  schedule?: any;
  blockType?: any;
  subject?: any;
  room?: any;
  days?: any;
  startTime?: any;
  endTime?: any;
  studentsInClass?: any;
}
const schema = new Schema<ITeacherScheduleRecord>(
  {
    category: { type: String },
    schoolYear: { type: String },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherProfile',
    },
    deanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeanProfile',
    },
    course: {
      name: { type: String },
      courseCode: { type: String },
    },
    // this sectionId will be used to compare which section and subject to compare with students
    blockType: {
      year: { type: String },
      semester: { type: String },
      section: { type: String },
    },
    subject: {
      fixedRateAmount: { type: String },
      preReq: { type: String },
      category: { type: String },
      subjectCode: { type: String },
      name: { type: String },
      lec: { type: String },
      lab: { type: String },
      unit: { type: String },
    },
    room: { roomName: { type: String } },
    days: {
      type: [String],
      default: [],
    },
    startTime: { type: String },
    endTime: { type: String },
    studentsInClass: [
      {
        student: {
          firstname: { type: String },
          middlename: { type: String },
          lastname: { type: String },
          extensionName: { type: String },
          sex: { type: String },
        },
        firstGrade: { type: Number },
        secondGrade: { type: Number },
        thirdGrade: { type: Number },
        fourthGrade: { type: Number },
        averageTotal: { type: Number },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const TeacherScheduleRecord = models.TeacherScheduleRecord || model<ITeacherScheduleRecord>('TeacherScheduleRecord', schema);
export default TeacherScheduleRecord;
