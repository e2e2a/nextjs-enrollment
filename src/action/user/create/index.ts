'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { SignupValidator } from '@/lib/validators/auth/signUp';
import { AdminProfileUpdateValidator, DeanProfileExtensionValidator, DeanProfileUpdateValidator, StudentProfileUpdateValidator, TeacherProfileUpdateValidator } from '@/lib/validators/profile/update';
import { createAdminProfile } from '@/services/adminProfile';
import { getCoursesById } from '@/services/course';
import { createDeanProfile } from '@/services/deanProfile';
import { createStudentProfile } from '@/services/studentProfile';
import { createTeacherProfile } from '@/services/teacherProfile';
import { createUser } from '@/services/user';
import { verifyADMIN } from '@/utils/actions/session/roles/admin';
import { checkNewEmail } from '@/utils/actions/user/email';
import { checkNewUsername } from '@/utils/actions/user/username';

/**
 * Handles the create user.
 *
 * @param {Object} data
 */
export const adminCreateUserWithRoleAction = async (data: any) => {
  try {
    await dbConnect();
    const session = await verifyADMIN();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const checkConflict = await checkingConflict(data);
    if (checkConflict && checkConflict.error) return { error: checkConflict?.error, status: checkConflict?.status };

    const checkedRole = await checkRole(data, checkConflict.data);
    if (checkedRole && checkedRole.error) return { error: checkedRole?.error, status: checkedRole?.status };

    return { message: `New ${data.role} is Created!`, role: data.role, status: 201 };
  } catch (error) {
    return { error: 'Something went wrong.', status: 500 };
  }
};

/**
 * Perfoms checking conflict of email and username
 *
 * @param {object} data
 */
const checkingConflict = async (data: any) => {
  return tryCatch(async () => {
    const userParse = SignupValidator.safeParse(data);
    if (!userParse.success) return { error: 'Invalid fields!', status: 400 };

    const existingUser = await checkNewEmail(userParse.data.email);
    if (existingUser && existingUser.emailVerified) return { error: 'Email already exist. Please sign in to continue.', status: 409 };

    const checkedUsername = await checkNewUsername(userParse.data.username);
    if (!checkedUsername || !checkedUsername.success) return { error: checkedUsername?.error, status: checkedUsername?.status };

    return { success: 'success', data: userParse.data, status: 200 };
  });
};

/**
 * check roles to store
 *
 * @param {object} data
 * @param {object} userData
 */
const checkRole = async (data: any, userData: any) => {
  return tryCatch(async () => {
    let profile;
    switch (data.role) {
      case 'STUDENT':
        profile = await createStudent(data, userData);
        break;
      case 'TEACHER':
        profile = await createTeacher(data, userData);
        break;
      case 'DEAN':
        profile = await createDean(data, userData);
        break;
      case 'ADMIN':
        profile = await createAdmin(data, userData);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    if (profile && profile.error) return { error: profile.error, status: profile.status };
    return { success: 'yesyes', status: 200 };
  });
};
/**
 * store user and profile
 *
 * @param {object} data
 * @param {object} userData
 */
const createAdmin = async (data: any, userData: any) => {
  return tryCatch(async () => {
    let profileParse;
    if (data.configProfile === 'Yes') {
      profileParse = AdminProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }
    const createdU = await createUser({ email: userData.email, username: userData.username, role: data.role, emailVerified: new Date(Date.now()) }, userData.password);
    if (!createdU) return { error: 'Error Creating User', status: 404 };

    if (data.configProfile === 'Yes') await createAdminProfile({ userId: createdU._id, ...profileParse!.data, isVerified: true });
    return { success: 'yesyes.', status: 201 };
  });
};

const createTeacher = async (data: any, userData: any) => {
  return tryCatch(async () => {
    let profileParse;
    if (data.configProfile === 'Yes') {
      profileParse = TeacherProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }
    const createdU = await createUser({ email: userData.email, username: userData.username, role: data.role, emailVerified: new Date(Date.now()) }, userData.password);
    if (!createdU) return { error: 'Error Creating User', status: 404 };

    if (data.configProfile === 'Yes') await createTeacherProfile({ userId: createdU._id, ...profileParse!.data, isVerified: true });
    return { success: 'yesyes.', status: 201 };
  });
};

const createDean = async (data: any, userData: any) => {
  return tryCatch(async () => {
    let profileParse;
    if (data.configProfile === 'Yes') {
      profileParse = DeanProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }

    const categoryParse = DeanProfileExtensionValidator.safeParse(data);
    if (!categoryParse.success) return { error: 'Invalid fields!', status: 400 };

    const course = await getCoursesById(categoryParse.data.courseId);
    if (!course) return { error: 'No course found.', status: 404 };

    const createdU = await createUser({ email: userData.email, username: userData.username, role: data.role, emailVerified: new Date(Date.now()) }, userData.password);
    if (!createdU) return { error: 'Error Creating User', status: 404 };

    let dataToUpdate;
    if (data.configProfile === 'Yes') {
      dataToUpdate = { ...profileParse!.data, courseId: course._id, isVerified: true };
    } else {
      dataToUpdate = { courseId: course._id };
    }

    await createDeanProfile({ userId: createdU._id, ...dataToUpdate });
    return { success: 'yesyes.', status: 201 };
  });
};

const createStudent = async (data: any, userData: any) => {
  return tryCatch(async () => {
    let profileParse;
    if (data.configProfile === 'Yes') {
      profileParse = StudentProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }
    const createdU = await createUser({ email: userData.email, username: userData.username, role: data.role, emailVerified: new Date(Date.now()) }, userData.password);
    if (!createdU) return { error: 'Error Creating User', status: 404 };

    if (data.configProfile === 'Yes') await createStudentProfile({ userId: createdU._id, ...profileParse!.data, isVerified: true });
    return { success: 'yesyes.', status: 201 };
  });
};
