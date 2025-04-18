'use server';
import { storage } from '@/firebase';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { CourseValidatorInCollege } from '@/lib/validators/course/create/college';
import { createCourse, getCourseByCourseCode, getCourseByName } from '@/services/course';
import { createCurriculum } from '@/services/curriculum';
import { verifyADMIN } from '@/utils/actions/session/roles/admin';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

/**
 * only admin roles
 * handle create course
 *
 * @param {object} data
 */
export const createCourseAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await verifyADMIN();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const { formData, ...remainData } = data;
    const courseParse = CourseValidatorInCollege.safeParse(remainData);
    if (!courseParse.success) return { error: 'Invalid fields!', status: 400 };

    const checkCourseCode = await getCourseByCourseCode(data.courseCode);
    if (checkCourseCode) return { error: 'Course code already exist, please choose another code.', status: 409 };

    const checkName = await getCourseByName(data.name);
    if (checkName) return { error: 'Course name already exist, please choose another name.', status: 409 };

    const a = await checkPhotoAndStore(formData, courseParse.data);

    return a;
  });
};

/**
 * check photo and save to firebase
 *
 * @param {any} formData
 * @param {object} data
 */
export const checkPhotoAndStore = async (formData: any, data: any) => {
  return tryCatch(async () => {
    const image = formData.get('image') as File;
    if (!image.name || image === null) return { error: 'File or photo is missing.', status: 403 };

    const cc = await createCourse(data);
    if (!cc) return { message: 'Something went wrong.', status: 500 };
    const storageRef = ref(storage, `courses/${cc._id}/${image.name}`);
    await uploadBytes(storageRef, image, { contentType: image.type });
    const url = await getDownloadURL(storageRef);
    cc.imageUrl = url;
    await cc.save();

    await createCurriculum({ category: data.category, courseId: cc._id });

    return { success: true, message: 'New Course has been added.', category: data.category, status: 201 };
  });
};
