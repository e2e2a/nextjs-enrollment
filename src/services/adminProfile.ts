'use server';
import mongoose from 'mongoose'
import AdminProfile from '@/models/AdminProfile';
const User = mongoose.models.User;

export const createAdminProfile = async (data: any) => {
  try {
    const newProfile = await AdminProfile.create({
      ...data,
    });
    return newProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllAdminProfile = async () => {
  try {
    const AProfile = await AdminProfile.find().populate('userId').exec();
    return AProfile;
  } catch (error) {
    return null;
  }
};

export const getAdminProfileById = async (id: any) => {
  try {
    const AProfile = await AdminProfile.findById(id).populate('userId').exec();
    return AProfile;
  } catch (error) {
    return null;
  }
};

export const getAdminProfileByUserId = async (userId: any) => {
  try {
    const AProfile = await AdminProfile.findOne({ userId }).populate('userId').exec();
    return AProfile;
  } catch (error) {
    return null;
  }
};
