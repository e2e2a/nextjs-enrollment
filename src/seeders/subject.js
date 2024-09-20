'use server';
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
    const conn = await mongoose.connect('mongodb://localhost:27017/mydbaseeeesd');
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

createSubjects();
