'use server';

import dbConnect from '@/lib/db/db';
import { StudentProfileValidator } from '@/lib/validators/Validator';
import { updateStudentProfileById, updateStudentProfileByUserId } from '@/services/studentProfile';

export const updateStudentProfile = async (data: any) => {
  try {
    await dbConnect();
    const { profileId } = data;
    const profileParse = StudentProfileValidator.safeParse(data);
    console.log('profileParse', profileParse);
    console.log('userId', profileId);
    const profile = await updateStudentProfileById(profileId, profileParse);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };
    return { message: 'Profile has been update. ', status: 201 };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error', status: 500 };
  }
};

export const updateStudentPhoto = async (data: any) => {
  try {
    await dbConnect();
    const { profileId, imageUrl } = data;
    const profile = await updateStudentProfileById(profileId, { data });
    if (!profile) return { error: 'Something went wrong. ', status: 500 };
    // console.log('profile', profile);
    return { message: 'Profile has been update. ', status: 201 };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error', status: 500 };
  }
};
