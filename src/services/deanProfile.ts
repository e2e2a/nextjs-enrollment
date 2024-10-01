'use server';
import DeanProfile from '@/models/DeanProfile';
import mongoose from 'mongoose';
const User = mongoose.models.User;

export const createDeanProfile = async (data: any) => {
  try {
    const newProfile = await DeanProfile.create({
      ...data,
    });
    return newProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllDeanProfile = async () => {
  try {
    const DProfile = await DeanProfile.find().populate('userId').populate('courseId').exec();
    return DProfile;
  } catch (error) {
    return [];
  }
};

export const getDeanProfileById = async (id: any) => {
  try {
    const DProfile = await DeanProfile.findById(id).populate('userId').populate('courseId').exec();
    return DProfile;
  } catch (error) {
    return null;
  }
};

export const getDeanProfileByUserId = async (userId: any) => {
  try {
    const DProfile = await DeanProfile.findOne({ userId }).populate('userId').populate('courseId').exec();
    return DProfile;
  } catch (error) {
    return null;
  }
};

export const updateDeanProfileById = async (id: string, data: any) => {
  try {
    const updatedProfile = await DeanProfile.findByIdAndUpdate(id, { ...data, isVerified: true }, { new: true });
    return updatedProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};
