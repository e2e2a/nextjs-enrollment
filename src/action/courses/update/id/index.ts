'use server';
import { storage } from '@/firebase';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { CourseValidatorInCollege } from '@/lib/validators/course/create/college';
import Course from '@/models/Course';
import { getCourseByCourseCode, getCourseByName, getCoursesById } from '@/services/course';
import { verifyADMIN } from '@/utils/actions/session/roles/admin';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Types } from 'mongoose';

/**
 * only admin roles
 * handle create course
 *
 * @param {object} data
 */
export const updateCourseByIdAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await verifyADMIN();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const a = await checkCategory(session.user, data);

    return a;
  });
};

/**
 * check category
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
 * check photo and save to firebase
 *
 * @param {File} formData
 * @param {object} data
 */
export const checkPhotoAndStore = async (formData: any, data: any, id: string) => {
  return tryCatch(async () => {
    const isValidObjectId = Types.ObjectId.isValid(id);
    if (!isValidObjectId) return { error: `Not valid.`, status: 400 };

    const cc = await Course.findByIdAndUpdate(id, { ...data });
    if (!cc) return { message: 'Something went wrong.', status: 500 };

    if (formData) {
      const image = formData.get('image') as File;
      if (image && image.name) {
        if (cc.imageUrl) {
          const oldImagePath = cc.imageUrl.replace(/.*\/o\/(.+?)\?.*/, '$1');
          const oldImageRef = ref(storage, decodeURIComponent(oldImagePath));

          await deleteObject(oldImageRef);
        }
        const storageRef = ref(storage, `courses/${cc._id}/${image.name}`);
        await uploadBytes(storageRef, image, { contentType: image.type });
        const url = await getDownloadURL(storageRef);
        cc.imageUrl = url;
        await cc.save();
      }
    }

    return { success: true, message: 'New Course has been added.', id: id, category: data.category, status: 201 };
  });
};

const categoryCollege = async (user: any, data: any) => {
  return tryCatch(async () => {
    const { formData, ...remainData } = data;
    const courseParse = CourseValidatorInCollege.safeParse(remainData);
    if (!courseParse.success) return { error: 'Invalid fields!', status: 400 };

    const course = await getCoursesById(data.id);
    if (!course) return { error: 'Course not found.', status: 404 };

    if (course.courseCode.toLowerCase() !== data.courseCode.toLowerCase()) {
      const checkCourseCode = await getCourseByCourseCode(data.courseCode);
      if (checkCourseCode) return { error: 'Course code already exist, please choose another code.', status: 409 };
    }

    if (course.name.toLowerCase() !== data.name.toLowerCase()) {
      const checkName = await getCourseByName(data.name);
      if (checkName) return { error: 'Course name already exist, please choose another name.', status: 409 };
    }

    const a = await checkPhotoAndStore(formData, courseParse.data, data.id);

    return a;
  });
};
