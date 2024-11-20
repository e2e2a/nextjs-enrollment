'use server';
import dbConnect from '@/lib/db/db';
import { getCourseByCourseCode } from '@/services/course';
import { createEnrollment, getEnrollmentByUserId } from '@/services/enrollment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import StudentProfile from '@/models/StudentProfile';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';
import { StudentProfileExtension } from '@/lib/validators/profile/extension';
import { getEnrollmentSetupByName } from '@/services/EnrollmentSetup';

/**
 * handles create enrollment action
 *
 * @param {object} data
 */
export const createEnrollmentByCategoryAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error || session.user.role !== 'STUDENT') return { error: 'Foribidden.', status: 403 };

    const checkEnrollment = await getEnrollmentByUserId(session.user._id);
    if (checkEnrollment) return { error: 'You are already Enrolled/Enrolling.', status: 409 };

    // we can check here if the student is having a enrollmentrecord and check by the category

    const checkedCategory = await checkCategory(session.user, data);

    return checkedCategory;
  });
};

/**
 * check category to enroll
 *
 * @param {object} user
 * @param {object} data
 */
const checkCategory = async (user: any, data: any) => {
  return tryCatch(async () => {
    let category;
    switch (data.category) {
      case 'College':
        category = await categoryCollege(user, data);
        break;
      default:
        return { error: 'Invalid category.', status: 400 };
    }

    return category;
  });
};

/**
 * enroll category college
 *
 * @param {object} user
 * @param {object} data
 */
const categoryCollege = async (user: any, data: any) => {
  return tryCatch(async () => {
    const checkedfiles = await checkPhotoAndFile(data);
    if (checkedfiles && checkedfiles.error) return { error: checkedfiles.error, status: checkedfiles.status };

    const getProfile = await getStudentProfileByUserId(user._id);
    if (!getProfile) return { error: 'You are enrolling without a profile.', status: 403 };

    const course = await getCourseByCourseCode(data.courseCode);
    if (!course) return { error: 'You are enrolling without a course.', status: 403 };

    const enrollmentSetup = await getEnrollmentSetupByName('GODOY');
    if (!enrollmentSetup.enrollmentTertiary.open) return { error: 'forbidden', status: 403 };

    const validated = await validateData(user, checkedfiles.files, getProfile._id, course._id, enrollmentSetup.enrollmentTertiary, data);
    if (validated && validated.error) return { error: validated.error, status: validated.status };

    await uploadFileOrPhoto(getProfile, checkedfiles.files);
    const cc = await createEnrollment(validated.eData);
    if (!cc) return { message: 'Something went wrong.', status: 500 };

    const updatedProfile = await StudentProfile.findByIdAndUpdate(getProfile._id, validated.pData, { new: true });
    if (!updatedProfile) return { message: 'Something went wrong.', status: 500 };

    return { success: true, message: `You are enrolling to this course ${course.courseCode.toUpperCase()}`, category: data.category, courseId: course._id.toString(), profileId: getProfile._id.toString(), userId: getProfile.userId._id.toString(), status: 201 };
  });
};

/**
 * validate and prepare data
 *
 * @param {object} user
 * @param {any} files
 * @param {string} profileId
 * @param {string} courseId
 * @param {object} eSetup
 * @param {object} data
 */
const validateData = async (user: any, files: any, profileId: string, courseId: string, eSetup: any, data: any) => {
  return tryCatch(async () => {
    const profileParse = StudentProfileExtension.safeParse(data);
    if (!profileParse.success) return { error: 'Invalid fields!', status: 400 };
    const sameData = {
      enrollStatus: 'Pending',
      studentSemester: eSetup.semester,
      courseId,
    };
    const pData = {
      ...profileParse.data,
      ...sameData,
      psaUrl: files.filePsa.name,
      photoUrl: files.photo.name,
      goodMoralUrl: files.fileGoodMoral ? files.fileGoodMoral.name : null,
      reportCardUrl: files.fileTOR ? files.fileTOR.name : null,
    };
    const eData = {
      ...sameData,
      category: data.category,
      userId: user._id,
      profileId,
      studentYear: data.studentYear,
      schoolYear: eSetup.schoolYear,
      onProcess: true,
      studentStatus: data.studentStatus,
    };
    return { success: true, pData, eData, status: 200 };
  });
};

/**
 * check files
 *
 * @param {object} data
 */
const checkPhotoAndFile = async (data: any) => {
  return tryCatch(async () => {
    const filePsa = data.formData.get('filePsa') as File;
    const fileGoodMoral = data.formData.get('fileGoodMoral') as File;
    const fileTOR = data.formData.get('fileTOR') as File;
    const photo = data.formData.get('photo') as File;
    if (!photo.name || photo === null) return { error: 'At least one 2x2 photo must be provided.', status: 403 };
    if (!filePsa.name || filePsa === null) return { error: 'At least one 2x2 photo must be provided.', status: 403 };

    if ((!fileGoodMoral || !fileGoodMoral.name) && (!fileTOR || !fileTOR.name)) return { error: 'At least one file or photo must be provided.', status: 403 };

    return { success: 'yesyes', files: { filePsa, fileGoodMoral, fileTOR, photo }, status: 200 };
  });
};

/**
 * check files
 *
 * @param {object} profile
 * @param {object} files
 */
const uploadFileOrPhoto = async (profile: any, files: any) => {
  return tryCatch(async () => {
    const uploads = [];

    const storageRefPhoto = ref(storage, `enrollment/studentphoto/${profile._id}/${files.photo.name}`);
    uploads.push(uploadBytes(storageRefPhoto, files.photo, { contentType: files.photo.type }));

    const storageRefFilePsa = ref(storage, `enrollment/psa/${profile._id}/${files.filePsa.name}`);
    uploads.push(uploadBytes(storageRefFilePsa, files.filePsa, { contentType: files.filePsa.type }));

    if (files.fileGoodMoral && files.fileGoodMoral.name) {
      const storageRefFileGoodMoral = ref(storage, `enrollment/goodMoral/${profile._id}/${files.fileGoodMoral.name}`);
      uploads.push(uploadBytes(storageRefFileGoodMoral, files.fileGoodMoral, { contentType: files.fileGoodMoral.type }));
    }

    if (files.fileTOR && files.fileTOR.name) {
      const storageRefFileTOR = ref(storage, `enrollment/reportCard/${profile._id}/${files.fileTOR.name}`);
      uploads.push(uploadBytes(storageRefFileTOR, files.fileTOR, { contentType: files.fileTOR.type }));
    }

    await Promise.all(uploads);
    return { success: 'yesyes', status: 201 };
  });
};
