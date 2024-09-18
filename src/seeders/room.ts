"use server"
import dbConnect from '@/lib/db/db';
import Room from '@/models/Room';
import mongoose from 'mongoose';

const createRooms = async () => {
  try {
    await dbConnect(); // Connect to your MongoDB

    const rooms = [];

    // Create rooms from 1 to 100
    for (let i = 1; i <= 100; i++) {
      rooms.push({
        roomName: `room ${i}`,
        educationLevel: 'tertiary',
        roomType: 'classroom',
        floorLocation: 'floor 1', // Assuming all rooms are on the same floor, you can customize this
        isRoomAvailable: true,
      });
    }

    // Insert the rooms into the Room collection
    await Room.insertMany(rooms);
    console.log('Room seeding complete');

    mongoose.connection.close(); // Close the DB connection after seeding
  } catch (error) {
    console.error('Error seeding rooms:', error);
  }
};

// Execute the seeder
createRooms();
