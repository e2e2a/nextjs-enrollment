'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { SignupValidator } from '@/lib/validators/auth/signUp';
import { AccountingProfileUpdateValidator, AdminProfileUpdateValidator, DeanProfileExtensionValidator, DeanProfileUpdateValidator, StudentProfileUpdateValidator, TeacherProfileUpdateValidator } from '@/lib/validators/profile/update';
import { createAccountingProfile } from '@/services/accountingProfile';
import { createAdminProfile } from '@/services/adminProfile';
import { getCoursesById } from '@/services/course';
import { createDeanProfile } from '@/services/deanProfile';
import { createStudentProfile } from '@/services/studentProfile';
import { createSuperAdminProfile } from '@/services/superAdminProfile';
import { createTeacherProfile } from '@/services/teacherProfile';
import { createUser } from '@/services/user';
import { checkAuth } from '@/utils/actions/session';
import { checkNewEmail } from '@/utils/actions/user/email';
import { checkNewUsername } from '@/utils/actions/user/username';

/**
 * Handles the create user.
 *
 * @param {Object} data
 */
export const adminCreateUserWithRoleAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    if (session.user.role !== 'SUPER ADMIN') return { error: 'Not Authorized.', status: 403 };

    const checkConflict = await checkingConflict(data);
    if (checkConflict && checkConflict.error) return { error: checkConflict?.error, status: checkConflict?.status };

    const checkedRole = await createProfile(data, checkConflict.data);

    return checkedRole;
  });
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
    if (existingUser && existingUser.error) return { error: 'Email already exist. Please sign in to continue.', status: existingUser.status };

    const checkedUsername = await checkNewUsername(userParse.data.username);
    if (checkedUsername && checkedUsername.error) return { error: checkedUsername?.error, status: checkedUsername?.status };

    return { success: true, data: userParse.data, status: 200 };
  });
};

/**
 * check roles to store profile
 *
 * @param {object} data
 * @param {object} userData
 */
const createProfile = async (data: any, userData: any) => {
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
      case 'ACCOUNTING':
        profile = await createAccounting(data, userData);
        break;
      case 'SUPER ADMIN':
        profile = await createSuperAdmin(data, userData);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    if (!profile) return { error: 'Not found', status: 404 };
    return { success: true, message: `New ${data.role} is Created!`, role: data.role, status: 201 };
  });
};

/**
 * store user and profile
 *
 * @param {object} data
 * @param {object} userData
 */
const createSuperAdmin = async (data: any, userData: any) => {
  return tryCatch(async () => {
    let profileParse;
    if (data.configProfile === 'Yes') {
      profileParse = AdminProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }
    const createdU = await createUser({ email: userData.email, username: userData.username, role: data.role, emailVerified: new Date(Date.now()) }, userData.password);
    if (!createdU) return { error: 'Error Creating User', status: 404 };

    await createSuperAdminProfile({ userId: createdU._id, ...(data.configProfile === 'Yes' ? { ...profileParse!.data, isVerified: true } : { isVerified: false }) });
    return { success: 'yesyes.', status: 201 };
  });
};

const createAdmin = async (data: any, userData: any) => {
  return tryCatch(async () => {
    let profileParse;
    if (data.configProfile === 'Yes') {
      profileParse = AdminProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }
    const createdU = await createUser({ email: userData.email, username: userData.username, role: data.role, emailVerified: new Date(Date.now()) }, userData.password);
    if (!createdU) return { error: 'Error Creating User', status: 404 };

    await createAdminProfile({ userId: createdU._id, ...(data.configProfile === 'Yes' ? { ...profileParse!.data, isVerified: true } : { isVerified: false }) });
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

    await createTeacherProfile({ userId: createdU._id, ...(data.configProfile === 'Yes' ? { ...profileParse!.data, isVerified: true } : { isVerified: false }) });
    return { success: true, status: 201 };
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

    await createStudentProfile({ userId: createdU._id, ...(data.configProfile === 'Yes' ? { ...profileParse!.data, isVerified: true } : { isVerified: false }) });
    return { success: true, status: 201 };
  });
};

const createAccounting = async (data: any, userData: any) => {
  return tryCatch(async () => {
    let profileParse;
    if (data.configProfile === 'Yes') {
      profileParse = AccountingProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }
    const createdU = await createUser({ email: userData.email, username: userData.username, role: data.role, emailVerified: new Date(Date.now()) }, userData.password);
    if (!createdU) return { error: 'Error Creating User', status: 404 };

    await createAccountingProfile({ userId: createdU._id, ...(data.configProfile === 'Yes' ? { ...profileParse!.data, isVerified: true } : { isVerified: false }) });
    return { success: 'yesyes.', status: 201 };
  });
};
