'use server';
const mongoose = require('mongoose');
const { Schema, models, model } = mongoose;
const schema = new Schema(
  {
    educationLevel: {
      type: String,
      enum: ['primary', 'secondary', 'tertiary'],
    },
    roomName: {
      type: String,
    },
    roomType: {
      type: String,
      enum: [
        'classroom',
        'science lab',
        'computer lab',
        'language lab',
        'engineering lab',
        'lecture hall',
        'seminar room',
        'library',
        'auditorium',
        'gym',
        'art room',
        'music room',
        'drama room',
        'woodshop',
        'metal workshop',
        'multipurpose room',
        'counseling room',
        'conference room',
        'cafeteria',
        'health clinic',
        'administration Office',
        'faculty room',
        'study hall',
        'playground',
        'special education room',
        'media room',
        'innovation room',
        'prayer room',
        'career counseling office',
        'greenhouse',
      ],
    },
    // I considered floorLocation for some purpose on printing the room for schedulesW
    floorLocation: {
      type: String,
    },
    isRoomAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Room = models.Room || model('Room', schema);

const createRooms = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/mydbaseeeesd123');

    const rooms = [];

    for (let i = 200; i <= 10200; i++) {
      rooms.push({
        roomName: `room ${i}`,
        educationLevel: 'tertiary',
        roomType: 'classroom',
        floorLocation: 'floor 1',
        isRoomAvailable: true,
      });
    }

    await Room.insertMany(rooms);
    console.log('Room seeding complete');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding rooms:', error);
  }
};

module.exports = createRooms;
