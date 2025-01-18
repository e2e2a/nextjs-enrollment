'use server';
import mongoose from 'mongoose';
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
    const AProfile = await AdminProfile.find()
      .populate({
        path: 'userId',
        select: '-password',
      })
      .exec();
    return AProfile;
  } catch (error) {
    return [];
  }
};

export const getAdminProfileById = async (id: any) => {
  try {
    const AProfile = await AdminProfile.findById(id)
      .populate({
        path: 'userId',
        select: '-password',
      })
      .exec();
    return AProfile;
  } catch (error) {
    return null;
  }
};

export const getAdminProfileByUserId = async (userId: any) => {
  try {
    const AProfile = await AdminProfile.findOne({ userId })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .exec();
    return AProfile;
  } catch (error) {
    return null;
  }
};

export const updateAdminProfileById = async (id: string, data: any) => {
  try {
    const updatedProfile = await AdminProfile.findByIdAndUpdate(id, { ...data, isVerified: true }, { new: true });
    return updatedProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateAdminProfileByUserId = async (userId: string, data: any) => {
  try {
    const updatedProfile = await AdminProfile.findOneAndUpdate({ userId }, { ...data }, { new: true });
    return updatedProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};
