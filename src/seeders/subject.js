'use server';
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema, models, model } = mongoose;
const schema = new Schema(
  {
    fixedRateAmount: {
      type: String,
    },
    category: {
      type: String,
    },
    subjectCode: {
      type: String,
    },
    name: {
      type: String,
    },
    lec: {
      type: String,
    },
    lab: {
      type: String,
    },
    unit: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Subject = models.Subject || model('Subject', schema);

const createSubjects = async () => {
  try {
    // const conn = await mongoose.connect('mongodb+srv://marzvelasco73019:F3AcEj0UXbkwn1lX@school.zcndgqd.mongodb.net/godoy?retryWrites=true&w=majority&appName=school');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    const subjects = [];

    // Loop to create subjects from 1 to 50
    for (let i = 1; i <= 50; i++) {
      subjects.push({
        category: 'College',
        subjectCode: `code ${i}`,
        name: `subject ${i}`,
        lec: '3',
        lab: '0',
        unit: '3',
      });
    }

    await Subject.insertMany(subjects);
    console.log('Subject seeding complete');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding subjects:', error);
  }
};

module.exports = createSubjects;
