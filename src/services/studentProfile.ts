'use server';

import StudentProfile from "@/models/StudentProfile";

export const createStudentProfileProvider = async (profile: any) => {
  try {
    const newProfile = await StudentProfile.create({
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
    const newProfile = await StudentProfile.create({
      ...data,
    });
    return JSON.parse(JSON.stringify(newProfile));
  } catch (error) {
    return null;
  }
};

export const getStudentProfileById = async (id: any) => {
  try {
    const studentProfile = await StudentProfile.findOne(id).populate('userId').exec();
    console.log(studentProfile);
    return JSON.parse(JSON.stringify(studentProfile));
  } catch (error) {
    return null;
  }
};

export const getStudentProfileByUserId = async (userId: any) => {
  try {
    console.log('received student profileid: ' + userId);
    const studentProfile = await StudentProfile.findOne({ userId }).populate('userId').exec();
    console.log('studentProfile', studentProfile);
    return JSON.parse(JSON.stringify(studentProfile));
  } catch (error) {
    return null;
  }
};

export const deleteStudentProfileByUserId = async (userId: string) => {
  try {
    await StudentProfile.findOneAndDelete({ userId: userId });
    return true;
  } catch (error) {
    return false;
  }
};
