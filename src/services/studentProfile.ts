'use server';
import StudentProfile from '@/models/StudentProfile';

export const createStudentProfileProvider = async (userId: any, profile: any) => {
  try {
    const newProfile = await StudentProfile.create({
      userId: userId,
      firstname: profile.given_name,
      lastname: profile.family_name,  
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
    console.log(error);
    return null;
  }
};

export const getAllStudentProfile = async () => {
  try {
    const studentProfile = await StudentProfile.find().populate('userId').exec();
    // console.log(studentProfile);
    return studentProfile;
  } catch (error) {
    return null;
  }
};

export const getStudentProfileById = async (id: any) => {
  try {
    const studentProfile = await StudentProfile.findOne(id).populate('userId').exec();
    // console.log(studentProfile);
    return JSON.parse(JSON.stringify(studentProfile));
  } catch (error) {
    return null;
  }
};

export const getStudentProfileByUserId = async (userId: any) => {
  try {
    const studentProfile = await StudentProfile.findOne({ userId }).populate('userId').exec();
    // console.log(studentProfile);
    // return JSON.parse(JSON.stringify(studentProfile));
    return studentProfile;
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

export const updateStudentProfileById = async (id: string, { data }: any) => {
  try {
    console.log('data in service', data)
    const updatedProfile = await StudentProfile.findByIdAndUpdate(id, { ...data, isVerified: true }, { new: true });
    return JSON.parse(JSON.stringify(updatedProfile));
  } catch (error) {
    return null;
  }
};
export const updateStudentProfileByUserId = async (userId: string, { data }: any) => {
  try {
    console.log('data in service', data)
    const updatedProfile = await StudentProfile.findOneAndUpdate({ userId }, { ...data, isVerified: true }, { new: true });
    return JSON.parse(JSON.stringify(updatedProfile));
  } catch (error) {
    return null;
  }
};
