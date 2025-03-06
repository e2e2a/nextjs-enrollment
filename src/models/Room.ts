import mongoose, { Schema, models, model } from 'mongoose';

export interface IRoom extends Document {
  educationLevel: string;
  roomName: string;
  roomType?: string;
  floorLocation?: string;
  isRoomAvailable: boolean;
  archive?: boolean;
  archiveBy?: mongoose.Schema.Types.ObjectId;
}

const schema = new Schema<IRoom>(
  {
    educationLevel: {
      type: String,
      enum: ['primary', 'secondary', 'tertiary'],
    },
    roomName: { type: String },
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
    archive: { type: Boolean, default: false },
    archiveBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeanProfile',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Room = models.Room || model<IRoom>('Room', schema);
export default Room;
