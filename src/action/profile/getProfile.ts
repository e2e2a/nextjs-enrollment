'use server';
import dbConnect from '@/lib/db/db';
import StudentProfile from '@/models/StudentProfile';
import { getSingleProfileResponse } from '@/types';

export const getStudentProfileBySessionId = async (userId: any):Promise <getSingleProfileResponse> => {
  try {
    await dbConnect();
    const studentProfile = await StudentProfile.findOne({ userId }).populate('userId').exec();
    // console.log(studentProfile);
    return { profile: JSON.parse(JSON.stringify(studentProfile)), status: 200 };
    // return studentProfile;
  } catch (error) {
    return { profile: null, status: 500 };
  }
};
