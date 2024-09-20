"use server"
const mongoose = require('mongoose');
const { Schema, models, model } = mongoose;

const schema = new Schema(
  {
    schoolYear: {
      type: String,
    },
    isEnable: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const SchoolYear = models.SchoolYear || model('SchoolYear', schema);
const createSchoolYears = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://marzvelasco73019:F3AcEj0UXbkwn1lX@school.zcndgqd.mongodb.net/godoy?retryWrites=true&w=majority&appName=school');

    const schoolYears = [];

    let startYear = 1999;
    const endYear = 2024;

    while (startYear <= endYear) {
      const nextYear = startYear + 1;
      schoolYears.push({
        schoolYear: `sy${startYear}-${nextYear}`,
        isEnable: false, 
      });
      startYear++;
    }

    await SchoolYear.insertMany(schoolYears);
    console.log('School year seeding complete');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding school years:', error);
  }
};

createSchoolYears();
