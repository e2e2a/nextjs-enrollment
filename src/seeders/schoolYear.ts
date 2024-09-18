"use server"
import dbConnect from '@/lib/db/db';
import SchoolYear from '@/models/SchoolYear';
import mongoose from 'mongoose';

const createSchoolYears = async () => {
  try {
    await dbConnect(); // Connect to your MongoDB

    const schoolYears = [];

    // Start year and end year
    let startYear = 1999;
    const endYear = 2024;

    // Loop through each year and create the next school year
    while (startYear <= endYear) {
      const nextYear = startYear + 1;
      schoolYears.push({
        schoolYear: `sy${startYear}-${nextYear}`,
        isEnable: false, // Default value
      });
      startYear++;
    }

    // Insert the school years into the SchoolYear collection
    await SchoolYear.insertMany(schoolYears);
    console.log('School year seeding complete');

    mongoose.connection.close(); // Close the DB connection after seeding
  } catch (error) {
    console.error('Error seeding school years:', error);
  }
};

// Execute the seeder
createSchoolYears();
