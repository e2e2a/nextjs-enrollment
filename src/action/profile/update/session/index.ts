'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { AccountingProfileUpdateValidator, AdminProfileUpdateValidator, DeanProfileUpdateValidator, StudentProfileUpdateValidator, TeacherProfileUpdateValidator } from '@/lib/validators/profile/update';
import { updateAdminProfileByUserId } from '@/services/adminProfile';
import { updateDeanProfileByUserId } from '@/services/deanProfile';
import { updateStudentProfileByUserId } from '@/services/studentProfile';
import { updateTeacherProfileByUserId } from '@/services/teacherProfile';
import { checkAuth } from '@/utils/actions/session';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import { updateAccountingProfileByUserId } from '@/services/accountingProfile';
import { updateSuperAdminProfileByUserId } from '@/services/superAdminProfile';

/**
 * Update profile by session action
 *
 * @param {Object} session
 * @param {Object} data
 */
export const updateProfileBySessionIdAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    if (data.formData) {
      const checkedPhoto = await checkPhotoAndSave(data, session);
      if (checkedPhoto && checkedPhoto.error) return { error: checkedPhoto.error, status: checkedPhoto.status };
      data.imageUrl = checkedPhoto.imageUrl;
    } else {
      data.isVerified = true;
    }

    const checkedR = await checkSessionRole(session, data);

    return checkedR;
  });
};

/**
 * check session roles
 *
 * @param {Object} session
 * @param {Object} data
 */
const checkSessionRole = async (session: any, data: any): Promise<any> => {
  return tryCatch(async () => {
    let profile;
    switch (session.user.role) {
      case 'STUDENT':
        profile = await updateStudentProfile(session.user._id, data);
        break;
      case 'TEACHER':
        profile = await updateTeacherProfile(session.user._id, data);
        break;
      case 'DEAN':
        profile = await updateDeanProfile(session.user._id, data);
        break;
      case 'ADMIN':
        profile = await updateAdminProfile(session.user._id, data);
        break;
      case 'SUPER ADMIN':
        profile = await updateSuperAdminProfile(session.user._id, data);
        break;
      case 'ACCOUNTING':
        profile = await updateAccountingProfile(session.user._id, data);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { userId: session.user._id.toString(), role: session.user.role, ...profile };
  });
};

/**
 * update student profile
 *
 * @param {String} userId
 * @param {Object} data
 */
const updateStudentProfile = async (userId: string, data: any) => {
  return tryCatch(async () => {
    if (!data.formData) {
      const profileParse = StudentProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }
    const profile = await updateStudentProfileByUserId(userId, data);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };
    return { message: 'Profile has been update. ', status: 201 };
  });
};

/**
 * update teacher profile
 *
 * @param {String} userId
 * @param {Object} data
 */
const updateTeacherProfile = async (userId: string, data: any) => {
  return tryCatch(async () => {
    if (!data.formData) {
      const profileParse = TeacherProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }
    const profile = await updateTeacherProfileByUserId(userId, data);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };
    return { message: 'Profile has been update. ', status: 201 };
  });
};

/**
 * update dean profile
 *
 * @param {String} userId
 * @param {Object} data
 */
const updateDeanProfile = async (userId: string, data: any) => {
  return tryCatch(async () => {
    if (!data.formData) {
      const profileParse = DeanProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }
    const profile = await updateDeanProfileByUserId(userId, data);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };
    return { message: 'Profile has been update. ', status: 201 };
  });
};

/**
 * update admin profile
 *
 * @param {String} userId
 * @param {Object} data
 */
const updateSuperAdminProfile = async (userId: string, data: any) => {
  return tryCatch(async () => {
    if (!data.formData) {
      const profileParse = AdminProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }

    const profile = await updateSuperAdminProfileByUserId(userId, data);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };

    return { message: 'Profile has been update. ', status: 201 };
  });
};

/**
 * update admin profile
 *
 * @param {String} userId
 * @param {Object} data
 */
const updateAdminProfile = async (userId: string, data: any) => {
  return tryCatch(async () => {
    if (!data.formData) {
      const profileParse = AdminProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }

    const profile = await updateAdminProfileByUserId(userId, data);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };

    return { message: 'Profile has been update. ', status: 201 };
  });
};

/**
 * update admin profile
 *
 * @param {String} userId
 * @param {Object} data
 */
const updateAccountingProfile = async (userId: string, data: any) => {
  return tryCatch(async () => {
    if (!data.formData) {
      const profileParse = AccountingProfileUpdateValidator.safeParse(data);
      if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    }

    const profile = await updateAccountingProfileByUserId(userId, data);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };

    return { message: 'Profile has been update. ', status: 201 };
  });
};

/**
 * check photo and save to firebase
 *
 * @param {Object} data
 * @param {Object} session
 */
export const checkPhotoAndSave = async (data: any, session: any) => {
  return tryCatch(async () => {
    const image = data.formData.get('image') as File;

    if (!image.name || image === null) return { error: 'File or photo is missing.', status: 403 };

    const storageRef = ref(storage, `profile/${session.user._id}/${image.name}`);
    await uploadBytes(storageRef, image, { contentType: image.type });
    const url = await getDownloadURL(storageRef);
    return { success: 'Success.', imageUrl: url, status: 200 };
  });
};
