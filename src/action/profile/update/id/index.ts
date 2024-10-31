'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { AdminProfileUpdateValidator, DeanProfileUpdateValidator, StudentProfileUpdateValidator, TeacherProfileUpdateValidator } from '@/lib/validators/profile/update';
import { updateAdminProfileByUserId } from '@/services/adminProfile';
import { updateDeanProfileByUserId } from '@/services/deanProfile';
import { updateStudentProfileByUserId } from '@/services/studentProfile';
import { updateTeacherProfileByUserId } from '@/services/teacherProfile';
import { checkAuth } from '@/utils/actions/session';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import { StudentProfileExtension } from '@/lib/validators/profile/extension';
import { getUserById } from '@/services/user';

/**
 * Update profile by session action
 *
 * @param {Object} data
 */
export const updateProfileByAdminAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN') return { error: 'Dont have permission.', status: 403 };

    const checkedR = await checkSessionRole(session, data);
    if (!checkedR.profile || checkedR.error) return { error: checkedR.error, status: checkedR.status };

    return { message: 'Profile has been updated. ', status: 201 };
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
    const u = await getUserById(data.userId);
    let profile;
    switch (u.role) {
      case 'STUDENT':
        profile = await updateStudentProfile(u._id, data);
        break;
      case 'TEACHER':
        profile = await updateTeacherProfile(u._id, data);
        break;
      case 'DEAN':
        profile = await updateDeanProfile(u._id, data);
        break;
      case 'ADMIN':
        profile = await updateAdminProfile(u._id, data);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    if (profile && profile.error) return { error: profile.error, status: profile.status };
    return { profile: JSON.parse(JSON.stringify(profile)), status: 200 };
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
    const filePsa = data.formData.has('filePsa') ? (data.formData.get('filePsa') as File) : null;
    const fileGoodMoral = data.formData.has('fileGoodMoral') ? (data.formData.get('fileGoodMoral') as File) : null;
    const fileTOR = data.formData.has('fileTOR') ? (data.formData.get('fileTOR') as File) : null;
    const photo = data.formData.has('photo') ? (data.formData.get('photo') as File) : null;

    const checked = await checkFilesAndValidate({ filePsa, fileGoodMoral, fileTOR, photo }, data);
    if (checked && checked.error) return { error: checked.error, status: checked.status };

    const profile = await updateStudentProfileByUserId(userId, checked.pData);
    if (!profile) return { error: 'Something went wrong. ', status: 500 };

    await uploadFileOrPhoto(profile, { filePsa, fileGoodMoral, fileTOR, photo });

    return { message: 'Profile has been update. ', status: 201 };
  });
};

const uploadFileOrPhoto = async (profile: any, files: any) => {
  return tryCatch(async () => {
    const uploads = [];
    if (files.photo && files.photo.name) {
      const storageRefPhoto = ref(storage, `enrollment/studentphoto/${profile._id}/${files.photo.name}`);
      uploads.push(uploadBytes(storageRefPhoto, files.photo, { contentType: files.photo.type }));
    }

    if (files.filesPsa && files.filePsa.name) {
      const storageRefFilePsa = ref(storage, `enrollment/psa/${profile._id}/${files.filePsa.name}`);
      uploads.push(uploadBytes(storageRefFilePsa, files.filePsa, { contentType: files.filePsa.type }));
    }

    if (files.fileGoodMoral && files.fileGoodMoral.name) {
      const storageRefFileGoodMoral = ref(storage, `enrollment/goodMoral/${profile._id}/${files.fileGoodMoral.name}`);
      uploads.push(uploadBytes(storageRefFileGoodMoral, files.fileGoodMoral, { contentType: files.fileGoodMoral.type }));
    }

    if (files.fileTOR && files.fileTOR.name) {
      const storageRefFileTOR = ref(storage, `enrollment/reportCard/${profile._id}/${files.fileTOR.name}`);
      uploads.push(uploadBytes(storageRefFileTOR, files.fileTOR, { contentType: files.fileTOR.type }));
      console.log('im here saved');
    }

    await Promise.all(uploads);
    return { success: 'yesyes', status: 201 };
  });
};

const checkFilesAndValidate = async (files: any, data: any) => {
  return tryCatch(async () => {
    const profileParse = StudentProfileUpdateValidator.safeParse(data);
    if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    let extionData;
    if (data.configuredExtension) {
      extionData = StudentProfileExtension.safeParse(data);
      if (!extionData.success) return { error: 'Invalid fields!', status: 400 };
    }
    const pData = {
      ...profileParse.data,
      ...(data.configuredExtension ? extionData?.data : {}),
      ...(data.configuredExtension
        ? {
            psaUrl: files.filePsa?.name,
            photoUrl: files.photo?.name,
            goodMoralUrl: files.fileGoodMoral?.name,
            reportCardUrl: files.fileTOR?.name,
          }
        : {}),
      isVerified: true,
    };
    const filteredData = Object.fromEntries(Object.entries(pData).filter(([_, value]) => value != null));
    return { message: 'Profile has been update. ', pData: filteredData, status: 201 };
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
    const profileParse = TeacherProfileUpdateValidator.safeParse(data);
    if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    const profile = await updateTeacherProfileByUserId(userId, { ...profileParse.data, isVerified: true });
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
    const profileParse = DeanProfileUpdateValidator.safeParse(data);
    if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };

    const profile = await updateDeanProfileByUserId(userId, { ...profileParse.data, isVerified: true });
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
    const profileParse = AdminProfileUpdateValidator.safeParse(data);
    if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };

    const profile = await updateAdminProfileByUserId(userId, { ...profileParse.data, isVerified: true });
    if (!profile) return { error: 'Something went wrong. ', status: 500 };

    return { message: 'Profile has been update. ', status: 201 };
  });
};
