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

const AdminProfile = models.AdminProfile || model('AdminProfile', schema);
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
const createAdminUsers = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  
  const password = 'qweqwe';
  const hashedPassword = await bcrypt.hash(password, 10);
  for (let i = 0; i < 100; i++) {
    const adminEmail = `admin${i}@gmail.com`;
    const admin = new User({
      email: adminEmail,
      username: `admin${i}`,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: '2000-09-19T16:00:00.000Z',
    });
    await admin.save();
    const adminProfile = new AdminProfile({
      userId: admin._id,
      age: '30',
      birthday: '2000-09-19T16:00:00.000Z',
      cityMunicipality: 'qweqwe',
      civilStatus: 'single',
      contact: '09123456789',
      emailFbAcc: 'facebook.com',
      extensionName: '',
      firstname: `admin${i}`,
      middlename: `admin${i}`,
      lastname: `admin${i}`,
      sex: 'male',
      isVerified: true,
    });
    await adminProfile.save();
  }
  return console.log('Admin User seeding complete');
};

module.exports = createAdminUsers;