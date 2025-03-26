'use server';
require('dotenv').config();
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
    learnerOrTraineeOrStudentClassification: { type: String },

    studentYear: {
      type: String,
    },
    semester: {
      type: String,
    },

    enrollStatus: {
      type: String,
      enum: ['Pending', 'Old Student', 'Completed'],
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
const createStudentUsers = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  // const conn = await mongoose.connect('mongodb+srv://marzvelasco73019:F3AcEj0UXbkwn1lX@school.zcndgqd.mongodb.net/godoy?retryWrites=true&w=majority&appName=school');
  const password = 'qweqwe';
  const hashedPassword = await bcrypt.hash(password, 10);
  for (let i = 0; i < 100; i++) {
    const studentEmail = `student${i}@example.com`;
    const student = new User({
      email: studentEmail,
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
  }
  return console.log('Admin User seeding complete');
};

createStudentUsers();
