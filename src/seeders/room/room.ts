'use server';
import Room from '@/models/Room';
import { roomData } from './roomData';

export const seedRoom = async () => {
  await Room.deleteMany({});
  console.log('Cleaned Room Collection');
  await Room.insertMany(roomData);
  console.log('Room seeding complete');
  return;
};
