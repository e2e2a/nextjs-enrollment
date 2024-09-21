'use server';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema, models, model } = mongoose;
const schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

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
    // learnerOrTraineeOrStudentClassification: { type: String },

    studentYear: {
      type: String,
    },
    semester: {
      type: String,
    },

    enrollStatus: {
      type: String,
      enum: ['Pending', 'Continue', 'Completed'],
    },

    imageUrl: { type: String },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const StudentProfile = models.StudentProfile || model('StudentProfile', schema);
const userSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String },
    password: { type: String },
    emailVerified: { type: Date },
    role: { type: String, enum: ['STUDENT', 'TEACHER', 'ADMIN'], default: 'STUDENT' },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const schemaEnrollment = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    blockTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlockType',
    },
    studentYear: {
      type: String,
    },
    studentSemester: {
      type: String,
    },
    onProcess: { type: Boolean, default: false },
    step: { type: Number, default: 1 },
    psaUrl: { type: String },
    photoUrl: {
      type: String,
    },
    pdfUrl: {
      type: String,
    },
    schoolYear: {
      type: String,
    },
    enrollStatus: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Approved', 'Rejected', 'Enrolled'],
    },
    studentStatus: {
      type: String,
      default: 'New Student',
      enum: ['New Student', 'Continue', 'Completed'],
    },

    isStudentProfile: {
      type: String,
    },
    studentType: {
      type: String,
      enum: ['Regular', 'Non-Regular'],
    },
    scholarType: {
      type: String,
      enum: ['TWSP', 'STEP', 'PESFA', 'UAQTEA', 'None'],
    },
    studentSubjects: [
      {
        teacherScheduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'TeacherSchedule',
        },

        profileId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'StudentProfile',
        },
        grade: { type: String },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Enrollment = models.Enrollment || model('Enrollment', schemaEnrollment);
const createStudentEnrollment = async () => {
  const conn = await mongoose.connect('mongodb://localhost:27017/mydbaseeeesd');
  // const conn = await mongoose.connect('mongodb+srv://marzvelasco73019:F3AcEj0UXbkwn1lX@school.zcndgqd.mongodb.net/godoy?retryWrites=true&w=majority&appName=school');
  const password = 'qweqwe';
  const courseId1 = '66ed5b5ff61463004fa34ba0';
  const courseId2 = '66ed5c07f61463004fa34bf1';
  // const blockTypeId1 = '66ed5f24f61463004fa3501c';
  // const blockTypeId2 = '';
  const hashedPassword = await bcrypt.hash(password, 10);
  for (let i = 0; i < 300; i++) {
    const courseId = i < 150 ? courseId1 : courseId2;
    // const blockTypeId = i < 150 ? blockTypeId1 : blockTypeId2;
    const studentEmail = `student${i}@example.com`;
    const student = new User({
      email: studentEmail,
      username: `student${i}`,
      password: hashedPassword,
      role: 'STUDENT',
      emailVerified: '2000-09-19T16:00:00.000Z',
    });
    await student.save();
    const studentProfile = new StudentProfile({
      userId: student._id,
      age: '24',
      barangay: 'qweqwe',
      birthPlaceCity: 'Dipolog City',
      birthPlaceProvince: 'Dipolog City',
      birthPlaceRegion: 'birthPlaceRegiony',
      birthday: '2000-09-19T16:00:00.000Z',
      cityMunicipality: 'qweqwe',
      civilStatus: 'single',
      contact: 'qweqwe',
      district: 'qweqwe',
      educationAttainment: 'high School graduate',
      emailFbAcc: 'facebook.com',
      employmentStatus: 'employed',
      extensionName: '',
      firstname: `reymond${i}`,
      middlename: `reymond${i}`,
      lastname: `reymond${i}`,
      sex: 'male',
      learnerOrTraineeOrStudentClassification: 'Displaced Worker (Local)',
      nationality: 'qweqwe',
      numberStreet: 'qweqwe',
      province: 'qweqwe',
      region: 'qqweqwe',
      isVerified: true,
    });
    await studentProfile.save();
    const studentEnrollment = new Enrollment({
      userId: student._id,
      profileId: studentProfile._id,
      courseId: courseId,
      studentYear: '1st year',
      studentSemester: '1st semester',
      onProcess: true,
      step: 1,
      enrollStatus: 'Enrolled',
      studentStatus: 'New Student',
      photoUrl: 'https://firebasestorage.googleapis.com/v0/b/my-project-eaeb4.appspot.com/o/enrollment%2Fstudentphoto%2F66e14c4c3b8dbdf7923c13c7%2Fatt.Gqvfkzdn53FSMWItGHwOkIaj4wfsZF7hPcU-g329MpQ.jpg?alt=media&token=5563659b-605c-4f3c-a209-3eb68b79770e',
      psaUrl: 'https://firebasestorage.googleapis.com/v0/b/my-project-eaeb4.appspot.com/o/enrollment%2Fpsa%2F66e14c4c3b8dbdf7923c13c7%2Fatt.fWoAMz1p0-hiGvbqhKldwMyoGae-asesqnK11GciQ70.jpg?alt=media&token=81e9ce4b-4874-4b0d-98e1-3e1e4551eb8b',
      schoolYear: 'sy2001-2002',
      // blockTypeId: blockTypeId,
    });
    await studentEnrollment.save();
  }
  console.log('Student enrollment seeding complete');
  return;
};

createStudentEnrollment();
