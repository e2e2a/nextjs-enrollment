"use server"
import dbConnect from '@/lib/db/db';
import Subject from '@/models/Subject';
import mongoose from 'mongoose';

const createSubjects = async () => {
  try {
    await dbConnect(); // Connect to your MongoDB

    const subjects = [];

    // Loop to create subjects from 1 to 50
    for (let i = 1; i <= 50; i++) {
      subjects.push({
        category: 'College',
        subjectCode: `code ${i}`,
        name: `subject ${i}`,
        lec: '3', // Assuming default value
        lab: '0', // Assuming default value
        unit: '3', // Assuming default value
      });
    }

    // Insert the subjects into the Subject collection
    await Subject.insertMany(subjects);
    console.log('Subject seeding complete');

    mongoose.connection.close(); // Close the DB connection after seeding
  } catch (error) {
    console.error('Error seeding subjects:', error);
  }
};

// Execute the seeder
createSubjects();
