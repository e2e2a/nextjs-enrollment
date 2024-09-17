'use server';
import dbConnect from '@/lib/db/db';
import { getCourseByCourseCode } from '@/services/course';
import { createEnrollment, deleteEnrollmentById, getEnrollmentById, getEnrollmentByUserId, updateEnrollmentById } from '@/services/enrollment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getEnrollmentResponse, getSingleEnrollmentResponse, IResponse } from '@/types';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';

export const createEnrollmentAction = async (data: any): Promise<getEnrollmentResponse> => {
  await dbConnect();
  try {
    const file = data.formData.get('file') as File;
    const photo = data.formData.get('photo') as File;
    if (!file.name || !photo.name || photo === null || file === null) {
      return { error: 'File or photo is missing.', status: 403 };
    }
    const checkEnrollment = await getEnrollmentByUserId(data.userId);
    if (checkEnrollment) return { error: 'You are already Enrolled/Enrolling.', status: 409 };
    const getProfile = await getStudentProfileByUserId(data.userId);
    if (!getProfile) return { error: 'You are enrolling without a course.', status: 403 };
    const course = await getCourseByCourseCode(data.courseCode);
    if (!course) return { error: 'You are enrolling without a course.', status: 403 };
    console.log('course: ' + course);
    delete data.courseCode;
    data.profileId = getProfile.id;
    data.courseId = course.id;
    // data.steps = 1;
    data.onProcess = true;
    /**
     * create a enrollment
     * review the steps
     *
     */

    const cc = await createEnrollment(data);
    if (!cc) return { message: 'Something went wrong.', status: 500 };
    const storageRefFile = ref(storage, `enrollment/psa/${cc._id}/${file.name}`);
    const storageRefPhoto = ref(storage, `enrollment/studentphoto/${cc._id}/${photo.name}`);

    // Start both uploads concurrently
    const [fileSnapshot, photoSnapshot] = await Promise.all([
      uploadBytes(storageRefFile, file, { contentType: file.type }), // Use `file.type`
      uploadBytes(storageRefPhoto, photo, { contentType: photo.type }), // Use `photo.type`
    ]);

    // Get URLs for both files
    const [fileUrl, photoUrl] = await Promise.all([getDownloadURL(fileSnapshot.ref), getDownloadURL(photoSnapshot.ref)]);

    // Update enrollment with both URLs in a single DB call
    const updatedEnrollment = await updateEnrollmentById(cc._id, { psaUrl: fileUrl, photoUrl });
    if (!updatedEnrollment) return { message: 'Something went wrong.', status: 500 };
    /**
     * @todo
     * create a message notification
     * pop it up
     */
    return { message: 'hello world success', status: 201 };
  } catch (error) {
    console.log(error);
  }
  return { message: 'hello world success', status: 201 };
};

export const deleteEnrollmentAction = async (EId: any): Promise<IResponse> => {
  try {
    await dbConnect();
    const e = await getEnrollmentById(EId);
    if (!e) return { error: 'You are deleting with non-existing enrollment.', status: 403 };
    if (e.step != 1) return { error: 'You are deleting with non-existing enrollment.', status: 403 };
    const deletedE = await deleteEnrollmentById(EId);
    if (!deletedE) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Deleted successfully', status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getSingleEnrollmentAction = async (userId: any): Promise<getSingleEnrollmentResponse> => {
  try {
    await dbConnect();
    const enrollment = await getEnrollmentByUserId(userId);
    return { enrollment: JSON.parse(JSON.stringify(enrollment)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
export const getAllEnrollmentAction = async (userId: any): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const enrollment = await getEnrollmentByUserId(userId);
    return { enrollment: JSON.parse(JSON.stringify(enrollment)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
export const getSingleEnrollmentByUserIdIdAction = async (userId: any): Promise<getSingleEnrollmentResponse> => {
  try {
    await dbConnect();
    const enrollment = await getEnrollmentByUserId(userId);
    if (!enrollment) return { error: 'No enrollment found.', status: 404 };
    return { enrollment: JSON.parse(JSON.stringify(enrollment)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
