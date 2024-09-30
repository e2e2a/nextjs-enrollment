'use server';
import dbConnect from '@/lib/db/db';
import { encryptData } from '@/lib/encryption';
import { getAdminProfileByUserId } from '@/services/adminProfile';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { getUserByUsername } from '@/services/user';
import { getSingleProfileResponse } from '@/types';

export const getStudentProfileBySessionId = async (userId: any): Promise<getSingleProfileResponse> => {
  try {
    await dbConnect();
    const studentProfile = await getStudentProfileByUserId(userId);
    return { profile: JSON.parse(JSON.stringify(studentProfile)), status: 200 };
  } catch (error) {
    console.log('getStudentProfileBySessionId', error);
    return { profile: null, status: 500 };
  }
};

export const getTeacherProfileBySessionId = async (userId: any): Promise<getSingleProfileResponse> => {
  try {
    await dbConnect();
    const teacherProfile = await getTeacherProfileByUserId(userId);
    // const encryptedTeacherProfile = encryptData(JSON.stringify(teacherProfile), 'mysecret7777');
    // return { profile: encryptedTeacherProfile, status: 200 };
    return { profile: JSON.parse(JSON.stringify(teacherProfile)), status: 200 };
  } catch (error) {
    console.log('getStudentProfileBySessionId', error);
    return { profile: null, status: 500 };
  }
};

export const getAdminProfileBySessionId = async (userId: any): Promise<getSingleProfileResponse> => {
  try {
    await dbConnect();
    const adminProfile = await getAdminProfileByUserId(userId);
    return { profile: JSON.parse(JSON.stringify(adminProfile)), status: 200 };
  } catch (error) {
    console.log('getStudentProfileBySessionId', error);
    return { profile: null, status: 500 };
  }
};

export const getStudentProfileByUsernameAction = async (username: string): Promise<getSingleProfileResponse> => {
  try {
    await dbConnect();
    const u = await getUserByUsername(username);
    if (!u) {
      return { profile: null, status: 500 };
    }
    const p = await getStudentProfileByUserId(u._id);
    return { profile: JSON.parse(JSON.stringify(p)), status: 200 };
  } catch (error) {
    console.log('getStudentProfileByUsernameAction', error);
    return { profile: null, status: 500 };
  }
};
