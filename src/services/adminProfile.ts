'use server';
import AdminProfile from '@/models/AdminProfile';

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
    const TProfile = await AdminProfile.find().populate('userId').exec();
    return TProfile;
  } catch (error) {
    return null;
  }
};

export const getAdminProfileById = async (id: any) => {
  try {
    const TProfile = await AdminProfile.findById(id).populate('userId').exec();
    return TProfile;
  } catch (error) {
    return null;
  }
};

export const getAdminProfileByUserId = async (userId: any) => {
  try {
    const TProfile = await AdminProfile.findOne({ userId }).populate('userId').exec();
    return TProfile;
  } catch (error) {
    return null;
  }
};
