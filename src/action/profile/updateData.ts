'use server';

import dbConnect from '@/lib/db/db';
import { StudentProfileValidator } from '@/lib/validators/Validator';
import { updateStudentProfileByUserId } from '@/services/studentProfile';

export const updateStudentProfile = async (data: any) => {
  try {
    await dbConnect();
    const { userId } = data;
    const profileParse = StudentProfileValidator.safeParse(data);
    console.log('profileParse', profileParse)
    console.log('userId', userId)
    const profile = await updateStudentProfileByUserId(userId, profileParse);
    // if(profile) console.log('profile', profile)
    return { message: 'Profile has been update. ', status: 201 };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error', status: 500 };
  }
};
