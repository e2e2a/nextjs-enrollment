'use server';
import SuperAdminProfile from '@/models/SuperAdminProfile';

export const createSuperAdminProfile = async (data: any) => {
  try {
    const newProfile = await SuperAdminProfile.create({ ...data });
    return newProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllSuperAdminProfile = async () => {
  try {
    const AProfile = await SuperAdminProfile.find()
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

export const getSuperAdminProfileById = async (id: any) => {
  try {
    const AProfile = await SuperAdminProfile.findById(id)
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

export const getSuperAdminProfileByUserId = async (userId: any) => {
  try {
    const AProfile = await SuperAdminProfile.findOne({ userId })
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

export const updateSuperAdminProfileById = async (id: string, data: any) => {
  try {
    const updatedProfile = await SuperAdminProfile.findByIdAndUpdate(id, { ...data, isVerified: true }, { new: true });
    return updatedProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateSuperAdminProfileByUserId = async (userId: string, data: any) => {
  try {
    const updatedProfile = await SuperAdminProfile.findOneAndUpdate({ userId }, { ...data }, { new: true });
    return updatedProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};
