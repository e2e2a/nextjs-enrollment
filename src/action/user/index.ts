'use server';
import dbConnect from '@/lib/db/db';
import { createAdminProfile, getAllAdminProfile } from '@/services/adminProfile';
import { getCourseByCourseCode } from '@/services/course';
import { createDeanProfile, getAllDeanProfile } from '@/services/deanProfile';
import { createStudentProfile, deleteStudentProfileByUserId, getAllStudentProfile } from '@/services/studentProfile';
import { createTeacherProfile, getAllTeacherProfile } from '@/services/teacherProfile';
import { createTeacherSchedule } from '@/services/teacherSchedule';
import { checkUserUsername, createUser, deleteUserByEmail, getUserByEmail, getUserByUsername } from '@/services/user';
import { getAllAdminProfileResponse, getAllDeanProfileResponse, getAllStudentProfileResponse, getAllTeacherProfileResponse } from '@/types';

export const getUserRoleStudentAction = async (): Promise<getAllStudentProfileResponse> => {
  try {
    await dbConnect();
    const students = await getAllStudentProfile();
    console.log(students);
    return { students: JSON.parse(JSON.stringify(students)), status: 200 };
    // return studentProfile;
  } catch (error) {
    console.log('getStudentProfileBySessionId', error);
    return { error: '', status: 500 };
  }
};

export const getUserRoleTeachertAction = async (): Promise<getAllTeacherProfileResponse> => {
  try {
    await dbConnect();
    const teachers = await getAllTeacherProfile();
    console.log(teachers);
    return { teachers: JSON.parse(JSON.stringify(teachers)), status: 200 };
    // return studentProfile;
  } catch (error) {
    console.log('getStudentProfileBySessionId', error);
    return { error: '', status: 500 };
  }
};
export const getUserRoleAdminAction = async (): Promise<getAllAdminProfileResponse> => {
  try {
    await dbConnect();
    const admins = await getAllAdminProfile();
    return { admins: JSON.parse(JSON.stringify(admins)), status: 200 };
  } catch (error) {
    console.log('getStudentProfileBySessionId', error);
    return { error: '', status: 500 };
  }
};

export const getUserRoleDeanAction = async (): Promise<getAllDeanProfileResponse> => {
  try {
    await dbConnect();
    const deans = await getAllDeanProfile();
    return { deans: JSON.parse(JSON.stringify(deans)), status: 200 };
  } catch (error) {
    console.log('getStudentProfileBySessionId', error);
    return { error: '', status: 500 };
  }
};

export const adminCreateUserWithRoleAction = async (data: any): Promise<getAllStudentProfileResponse> => {
  try {
    await dbConnect();
    const { email, password, username, role, courseCode, createProfile, ...remainDatas } = data;

    const checkConflict = await checkingConflict(email, username);
    if (!checkConflict.success) return { error: checkConflict?.error, status: checkConflict?.status };
    let course;
    if (courseCode) {
      course = await getCourseByCourseCode(courseCode);
      if (!course) return { error: 'No course found.', status: 404 };
    }
    const createdU = await createUser({ email, username, role, emailVerified: new Date(Date.now()) }, password);
    if (!createdU) return { error: 'Error Creating User', status: 404 };
    let isVerified;
    isVerified = false;
    if (createProfile) {
      isVerified = true;
    }
    if (role === 'ADMIN') {
      //profile for ADMIN
      const createdP = await createAdminProfile({ userId: createdU._id, ...remainDatas, isVerified: isVerified });
      if (!createdP) return { error: 'Error Creating Admin Profile', status: 404 };
    } else if (role === 'DEAN') {
      const createdP = await createDeanProfile({ userId: createdU._id, courseId: course._id, ...remainDatas, isVerified: isVerified });
      if (!createdP) return { error: 'Error Creating Dean Profile', status: 404 };
    } else if (role === 'TEACHER') {
      const createdP = await createTeacherProfile({ userId: createdU._id, ...remainDatas, isVerified: isVerified });
      if (!createdP) return { error: 'Error Creating Teacher Profile', status: 404 };
      // const createdS = await createTeacherSchedule({ profileId: createdP._id, category: 'College' });
      // if (!createdS) return { error: 'Error Creating Schedule', status: 404 };
    } else if (role === 'STUDENT') {
      const createdP = await createStudentProfile({ userId: createdU._id, isVerified: isVerified });
      if (!createdP) return { error: 'Error Creating Student Profile', status: 404 };
      return { message: 'New Teacher is Created!', role: role, status: 201 };
    }
    return { message: `New ${role} is Created!`, role: role, status: 201 };
  } catch (error) {
    return { error: 'Something went wrong.', status: 500 };
  }
};

const checkingConflict = async (email: string, username: string) => {
  await dbConnect();
  const existingUser = await getUserByEmail(email);
  try {
    if (existingUser) {
      if (existingUser.emailVerified) {
        return { error: 'Email already exist. Please provide another email.', status: 409 };
      }
      const checkUsername = await getUserByUsername(username);
      if (checkUsername) {
        if (checkUsername.emailVerified) {
          return { error: 'Username already exist. Please provide another username.', status: 409 };
        } else {
          await deleteStudentProfileByUserId(checkUsername._id);
          await deleteUserByEmail(checkUsername.email);
        }
      }
    } else {
      const checkUsername = await getUserByUsername(username);
      if (checkUsername) {
        if (checkUsername.emailVerified) {
          return { error: 'Username already exist. Please provide another username.', status: 409 };
        } else {
          await deleteStudentProfileByUserId(checkUsername._id);
          await deleteUserByEmail(checkUsername.email);
        }
      }
    }
  } catch (error) {
    console.log('this is my erro in conflict', error);
  }
  return { success: 'success', status: 200 };
};

const creatingUserRoleTeacher = async (email: string, username: string, password: string) => {
  await dbConnect();
  const user = await createUser({ email, username }, password);
  await createStudentProfile({ userId: user._id });
  if (!user) return { error: 'Error creating User', status: 404 };
  /**
   * @todo remove comment
   */
  // const tokenType = 'Verify';
  // const verificationToken = await generateVerificationToken(user._id, tokenType);

  // if (!verificationToken) return { error: 'Error creating verificationToken', status: 404 };

  // const send = await sendVerificationEmail(verificationToken.email, verificationToken.code, username, 'Confirm your Email');
  // if (!send) return { error: 'Error sending verification email', status: 404 };
  // return { user: user, token: verificationToken.token };
  return { user: user, status: 201 };
};
