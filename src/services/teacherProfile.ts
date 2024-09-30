'use server';
import TeacherProfile from '@/models/TeacherProfile';

export const createTeacherProfile = async (data: any) => {
  try {
    const newProfile = await TeacherProfile.create({
      ...data,
    });
    return newProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllTeacherProfile = async () => {
  try {
    const TProfile = await TeacherProfile.find().populate('userId').exec();
    return TProfile;
  } catch (error) {
    return null;
  }
};

export const getTeacherProfileById = async (id: any) => {
  try {
    const TProfile = await TeacherProfile.findById(id).populate('userId').exec();
    return TProfile;
  } catch (error) {
    return null;
  }
};

export const getTeacherProfileByUserId = async (userId: any) => {
  try {
    const TProfile = await TeacherProfile.findOne({ userId }).populate('userId').exec();
    return TProfile;
  } catch (error) {
    return null;
  }
};

export const updateTeacherProfileById = async (id: string, data: any) => {
  try {
    const updatedProfile = await TeacherProfile.findByIdAndUpdate(id, { ...data, isVerified: true }, { new: true });
    return updatedProfile;
  } catch (error) {
    console.log(error)
    return null;
  }
};
