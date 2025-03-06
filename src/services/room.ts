'use server';
import Room from '@/models/Room';

export const createRoom = async (data: any) => {
  try {
    const newS = new Room({ ...data });
    const s = await newS.save();
    return s;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllRoom = async () => {
  try {
    const r = await Room.find({ archive: { $ne: true } });
    return r;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getRoomByEduLevel = async (educationLevel: string) => {
  try {
    const r = await Room.find({ educationLevel, archive: { $ne: true } });
    return r;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllRoomByEduLevel = async (educationLevel: string) => {
  try {
    const r = await Room.find({ educationLevel });
    return r;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getRoomById = async (id: any) => {
  try {
    const r = await Room.findById(id).exec();
    return r;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getRoomByName = async (roomName: any) => {
  try {
    const r = await Room.findOne({ roomName, archive: { $ne: true } });
    return r;
  } catch (error) {
    console.log(error);
    return null;
  }
};
