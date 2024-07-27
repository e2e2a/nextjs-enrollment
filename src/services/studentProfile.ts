'use server';

import StudentProfiles from "@/models/StudentProfiles";

export const createStudentProfileProvider = async (profile: any) => {
  try {
    const newProfile = await StudentProfiles.create({
      firstname: profile.given_name,
      lastname: profile.family_name,
      email: profile.email,
      imageUrl: profile.picture,
    });
    return JSON.parse(JSON.stringify(newProfile));
  } catch (error) {
    return null;
  }
};

export const createStudentProfile = async (data: any) => {
  try {
    const newProfile = await StudentProfiles.create({
      ...data,
    });
    return JSON.parse(JSON.stringify(newProfile));
  } catch (error) {
    return null;
  }
};

export const getStudentProfileById = async (id: any) => {
  try {
    const studentProfile = await StudentProfiles.findOne(id).populate('userId').exec();
    console.log(studentProfile);
    return JSON.parse(JSON.stringify(studentProfile));
  } catch (error) {
    return null;
  }
};

export const getStudentProfileByUserId = async (userId: any) => {
  try {
    const studentProfile = await StudentProfiles.findOne({ userId }).populate('userId').exec();
    console.log(studentProfile);
    return JSON.parse(JSON.stringify(studentProfile));
  } catch (error) {
    return null;
  }
};

export const deleteStudentProfileByUserId = async (userId: string) => {
  try {
    await StudentProfiles.findOneAndDelete({ userId: userId });
    return true;
  } catch (error) {
    return false;
  }
};
