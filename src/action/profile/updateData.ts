'use server';
import dbConnect from '@/lib/db/db';
import { AdminProfileBySessionIdValidator } from '@/lib/validators/AdminValidator';
import { TeacherProfileValidator } from '@/lib/validators/TeacherValidator';
import { StudentProfileValidator } from '@/lib/validators/Validator';
import { updateAdminProfileById } from '@/services/adminProfile';
import { updateStudentProfileById, updateStudentProfileByUserId } from '@/services/studentProfile';
import { updateTeacherProfileById } from '@/services/teacherProfile';

export const updateStudentProfile = async (data: any) => {
  try {
    await dbConnect();
    const { profileId } = data;
    const profileParse = StudentProfileValidator.safeParse(data);
    const profile = await updateStudentProfileById(profileId, profileParse);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };
    return { message: 'Profile has been update. ', status: 201 };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error', status: 500 };
  }
};

export const updateTeacherProfile = async (data: any) => {
  try {
    await dbConnect();
    const { profileId } = data;
    const profileParse = TeacherProfileValidator.safeParse(data);
    const { ...dateToUpdate } = profileParse.data;
    const profile = await updateTeacherProfileById(profileId, dateToUpdate);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };
    return { message: 'Profile has been update. ', status: 201 };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error', status: 500 };
  }
};
export const updateAdminProfile = async (data: any) => {
  try {
    await dbConnect();
    const { profileId } = data;
    const profileParse = AdminProfileBySessionIdValidator.safeParse(data);
    const { ...dateToUpdate } = profileParse.data;
    const profile = await updateAdminProfileById(profileId, dateToUpdate);
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
    const { profileId, role, ...dataToUpdate } = data;
    //check role
    if (!role) return { error: 'Forbidden. ', status: 403 };
    let profile;
    if (role === 'STUDENT') {
      /**
       * @todo this will be an error in updateStudentProfileById
       */
      profile = await updateStudentProfileById(profileId, dataToUpdate);
    } else if (role === 'TEACHER') {
      profile = await updateTeacherProfileById(profileId, dataToUpdate);
    } else if (role === 'ADMIN') {
      profile = await updateAdminProfileById(profileId, dataToUpdate);
    } else if (role === 'DEAN') {
      /**
       * @todo dean photo
       * 1. create a dean schema models
       */
    }
    if (!profile) return { error: 'Something went wrong. ', status: 500 };
    return { message: 'Profile has been update. ', role: role, status: 201 };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error', status: 500 };
  }
};
