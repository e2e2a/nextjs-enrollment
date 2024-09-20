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
    contact: { type: String },
    sex: { type: String },
    civilStatus: { type: String },
    birthday: { type: Date },
    age: { type: String },
    imageUrl: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const TeacherProfile = models.TeacherProfile || model('TeacherProfile', schema);
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

const createTeacherUsers = async () => {
  const conn = await mongoose.connect('mongodb+srv://marzvelasco73019:F3AcEj0UXbkwn1lX@school.zcndgqd.mongodb.net/godoy?retryWrites=true&w=majority&appName=school');
  const password = 'qweqwe';
  const hashedPassword = await bcrypt.hash(password, 10);
  for (let i = 0; i < 100; i++) {
    const teacherEmail = `teach${i}@gmail.com`;
    const teacher = new User({
      email: teacherEmail,
      username: `teach${i}`,
      password: hashedPassword,
      role: 'TEACHER',
      emailVerified: '2000-09-19T16:00:00.000Z',
    });
    await teacher.save();
    const teacherProfile = new TeacherProfile({
      userId: teacher._id,
      age: '30',
      birthday: '2000-09-19T16:00:00.000Z',
      cityMunicipality: 'qweqwe',
      civilStatus: 'single',
      contact: '09123456789',
      emailFbAcc: 'facebook.com',
      extensionName: '',
      firstname: `teach${i}`,
      middlename: `teach${i}`,
      lastname: `teach${i}`,
      sex: 'male',
      isVerified: true,
    });
    await teacherProfile.save();
  }
  console.log('Teacher seeding complete');
  mongoose.connection.close();
};

createTeacherUsers();
