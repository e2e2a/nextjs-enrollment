'use server';
import dbConnect from '@/lib/db/db';
import { getCourseByCourseCode } from '@/services/course';
import { createEnrollment, deleteEnrollmentById, getEnrollmentById, getEnrollmentByUserId, updateEnrollmentById } from '@/services/enrollment';
import { getStudentProfileByUserId, updateStudentProfileById } from '@/services/studentProfile';
import { getEnrollmentResponse, getSingleEnrollmentResponse, IResponse } from '@/types';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import StudentProfile from '@/models/StudentProfile';

export const createEnrollmentAction = async (data: any): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const filePsa = data.formData.get('filePsa') as File;
    const fileGoodMoral = data.formData.get('fileGoodMoral') as File;
    const fileTOR = data.formData.get('fileTOR') as File;
    const photo = data.formData.get('photo') as File;
    if (!filePsa.name || filePsa === null || !fileGoodMoral.name || fileGoodMoral === null || !fileTOR.name || fileTOR === null || !photo.name || photo === null) {
      return { error: 'File or photo is missing.', status: 403 };
    }
    const checkEnrollment = await getEnrollmentByUserId(data.userId);
    if (checkEnrollment) return { error: 'You are already Enrolled/Enrolling.', status: 409 };
    const getProfile = await getStudentProfileByUserId(data.userId);
    if (!getProfile) return { error: 'You are enrolling without a profile.', status: 403 };
    const course = await getCourseByCourseCode(data.courseCode);
    if (!course) return { error: 'You are enrolling without a course.', status: 403 };
    delete data.courseCode;
    data.profileId = getProfile._id;
    data.courseId = course._id;
    data.onProcess = true;

    const cc = await createEnrollment(data);
    if (!cc) return { message: 'Something went wrong.', status: 500 };

    const storageRefFilePsa = ref(storage, `enrollment/psa/${getProfile._id}/${filePsa.name}`);
    const storageRefFileGoodMoral = ref(storage, `enrollment/goodMoral/${getProfile._id}/${fileGoodMoral.name}`);
    const storageRefFileTOR = ref(storage, `enrollment/reportCard/${getProfile._id}/${fileTOR.name}`);
    const storageRefPhoto = ref(storage, `enrollment/studentphoto/${getProfile._id}/${photo.name}`);

    const [fileSnapshot, photoSnapshot] = await Promise.all([
      uploadBytes(storageRefFilePsa, filePsa, { contentType: filePsa.type }),
      uploadBytes(storageRefFileGoodMoral, fileGoodMoral, { contentType: fileGoodMoral.type }),
      uploadBytes(storageRefFileTOR, fileTOR, { contentType: fileTOR.type }),
      uploadBytes(storageRefPhoto, photo, { contentType: photo.type }),
    ]);

    // const [fileUrl, photoUrl] = await Promise.all([getDownloadURL(fileSnapshot.ref), getDownloadURL(photoSnapshot.ref)]);
    const dataToUpdateProfile = {
      courseId: data.courseId,
      psaUrl: filePsa.name,
      photoUrl: photo.name,
      goodMoralUrl: fileGoodMoral.name,
      reportCardUrl: fileTOR.name,
      studentYear: data.studentYear,
      studentSemester: data.studentSemester,
      enrollStatus: 'Pending',
      // educational background
      primarySchoolName: data.primarySchoolName,
      primarySchoolYear: data.primarySchoolYear,
      secondarySchoolName: data.secondarySchoolName,
      secondarySchoolYear: data.secondarySchoolYear,
      seniorHighSchoolName: data.seniorHighSchoolName,
      seniorHighSchoolYear: data.seniorHighSchoolYear,
      seniorHighSchoolStrand: data.seniorHighSchoolStrand,
      // Parent's Information
      FathersLastName: data.FathersLastName,
      FathersFirstName: data.FathersFirstName,
      FathersMiddleName: data.FathersMiddleName,
      FathersContact: data.FathersContact,
      MothersLastName: data.MothersLastName,
      MothersFirstName: data.MothersFirstName,
      MothersMiddleName: data.MothersMiddleName,
      MothersContact: data.MothersContact,
    };
    const updatedProfile = await StudentProfile.findByIdAndUpdate(getProfile._id, dataToUpdateProfile);
    if (!updatedProfile) return { message: 'Something went wrong.', status: 500 };
    /**
     * @todo
     * create a message notification
     * pop it up
     */
    return { message: 'hello world success', status: 201 };
  } catch (error) {
    console.log(error);
    return { error: 'hello world error', status: 500 };
  }
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
