'use server';
import dbConnect from '@/lib/db/db';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getUserByUsername } from '@/services/user';
import { getSingleProfileResponse } from '@/types';

export const getStudentProfileBySessionId = async (userId: any):Promise <getSingleProfileResponse> => {
  try {
    await dbConnect();
    const studentProfile = await getStudentProfileByUserId(userId);
    // console.log(studentProfile);
    return { profile: JSON.parse(JSON.stringify(studentProfile)), status: 200 };
    // return studentProfile;
  } catch (error) {
    console.log('getStudentProfileBySessionId', error);
    return { profile: null, status: 500 };
  }
};

export const getStudentProfileByUsernameAction = async (username: string):Promise <getSingleProfileResponse> => {
  try {
    await dbConnect()
    const u = await getUserByUsername(username)
    const p = await getStudentProfileByUserId(u._id);
    console.log('username aerver', p);
    return { profile: JSON.parse(JSON.stringify(p)), status: 200 }
  } catch (error) {
    console.log('getStudentProfileByUsernameAction', error);
    return { profile: null, status: 500 };
  }
}
