'use server';
import dbConnect from '@/lib/db/db';
import { getCourseByCourseCode } from '@/services/course';
import { createEnrollment, getEnrollmentByUserId } from '@/services/enrollment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getEnrollmentResponse } from '@/types';
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

    const checkEnrollment = await getEnrollmentByUserId(data.userId);
    if (checkEnrollment) return { error: 'You are already Enrolled/Enrolling.', status: 409 };
    const getProfile = await getStudentProfileByUserId(data.userId);
    if (!getProfile) return { error: 'You are enrolling without a profile.', status: 403 };
    const course = await getCourseByCourseCode(data.courseCode);
    if (!course) return { error: 'You are enrolling without a course.', status: 403 };
    delete data.courseCode;
    data.profileId = getProfile._id;
    data.courseId = course._id;
    // data.onProcess = true;

    const cc = await createEnrollment(data);
    if (!cc) return { message: 'Something went wrong.', status: 500 };

    // Initialize storage reference variables only if the file exists
    let storageRefFilePsa, storageRefFileGoodMoral, storageRefFileTOR, storageRefPhoto;
    if (filePsa && filePsa.name) {
      storageRefFilePsa = ref(storage, `enrollment/psa/${getProfile._id}/${filePsa.name}`);
    }
    if (fileGoodMoral && fileGoodMoral.name) {
      storageRefFileGoodMoral = ref(storage, `enrollment/goodMoral/${getProfile._id}/${fileGoodMoral.name}`);
    }
    if (fileTOR && fileTOR.name) {
      storageRefFileTOR = ref(storage, `enrollment/reportCard/${getProfile._id}/${fileTOR.name}`);
    }
    if (photo && photo.name) {
      storageRefPhoto = ref(storage, `enrollment/studentphoto/${getProfile._id}/${photo.name}`);
    }

    // Prepare upload promises for files that exist
    const uploadPromises = [];

    if (storageRefFilePsa) {
      uploadPromises.push(uploadBytes(storageRefFilePsa, filePsa, { contentType: filePsa.type }));
    }
    if (storageRefFileGoodMoral) {
      uploadPromises.push(uploadBytes(storageRefFileGoodMoral, fileGoodMoral, { contentType: fileGoodMoral.type }));
    }
    if (storageRefFileTOR) {
      uploadPromises.push(uploadBytes(storageRefFileTOR, fileTOR, { contentType: fileTOR.type }));
    }
    if (storageRefPhoto) {
      uploadPromises.push(uploadBytes(storageRefPhoto, photo, { contentType: photo.type }));
    }

    // Wait for all uploads to complete and get the snapshots
    const [filePsaSnapshot, fileGoodMoralSnapshot, fileTORSnapshot, photoSnapshot] = await Promise.all(uploadPromises);

    // const [fileUrl, photoUrl] = await Promise.all([getDownloadURL(fileSnapshot.ref), getDownloadURL(photoSnapshot.ref)]);
    const dataToUpdateProfile = {
      psaUrl: filePsa.name,
      photoUrl: photo.name,
      goodMoralUrl: fileGoodMoral.name,
      reportCardUrl: fileTOR.name,
      studentYear: data.studentYear,
      studentSemester: data.studentSemester,
    //   enrollStatus: 'Pending',
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
