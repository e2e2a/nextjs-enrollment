'use server';
import dbConnect from '@/lib/db/db';
import { getCourseByCourseCode } from '@/services/course';
import { createEnrollment, deleteEnrollmentById, getEnrollmentById, getEnrollmentByProfileId, getEnrollmentByUserId, updateEnrollmentById } from '@/services/enrollment';
import { getStudentProfileById, getStudentProfileByUserId } from '@/services/studentProfile';
import { getEnrollmentResponse, getSingleEnrollmentResponse, IResponse } from '@/types';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import StudentProfile from '@/models/StudentProfile';
import Enrollment from '@/models/Enrollment';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getStudentEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';

// export const createEnrollmentAction = async (data: any): Promise<getEnrollmentResponse> => {
//   try {
//     await dbConnect();
//     const filePsa = data.formData.get('filePsa') as File;
//     const fileGoodMoral = data.formData.get('fileGoodMoral') as File;
//     const fileTOR = data.formData.get('fileTOR') as File;
//     const photo = data.formData.get('photo') as File;
//     if (!filePsa.name || filePsa === null || !fileGoodMoral.name || fileGoodMoral === null || !fileTOR.name || fileTOR === null || !photo.name || photo === null) {
//       return { error: 'File or photo is missing.', status: 403 };
//     }
//     const checkEnrollment = await getEnrollmentByUserId(data.userId);
//     if (checkEnrollment) return { error: 'You are already Enrolled/Enrolling.', status: 409 };
//     const getProfile = await getStudentProfileByUserId(data.userId);
//     if (!getProfile) return { error: 'You are enrolling without a profile.', status: 403 };
//     const course = await getCourseByCourseCode(data.courseCode);
//     if (!course) return { error: 'You are enrolling without a course.', status: 403 };
//     delete data.courseCode;
//     data.profileId = getProfile._id;
//     data.courseId = course._id;
//     data.onProcess = true;
//     data.category = 'College';

//     const cc = await createEnrollment(data);
//     if (!cc) return { message: 'Something went wrong.', status: 500 };

//     const storageRefFilePsa = ref(storage, `enrollment/psa/${getProfile._id}/${filePsa.name}`);
//     const storageRefFileGoodMoral = ref(storage, `enrollment/goodMoral/${getProfile._id}/${fileGoodMoral.name}`);
//     const storageRefFileTOR = ref(storage, `enrollment/reportCard/${getProfile._id}/${fileTOR.name}`);
//     const storageRefPhoto = ref(storage, `enrollment/studentphoto/${getProfile._id}/${photo.name}`);

//     const [fileSnapshot, photoSnapshot] = await Promise.all([
//       uploadBytes(storageRefFilePsa, filePsa, { contentType: filePsa.type }),
//       uploadBytes(storageRefFileGoodMoral, fileGoodMoral, { contentType: fileGoodMoral.type }),
//       uploadBytes(storageRefFileTOR, fileTOR, { contentType: fileTOR.type }),
//       uploadBytes(storageRefPhoto, photo, { contentType: photo.type }),
//     ]);

//     // const [fileUrl, photoUrl] = await Promise.all([getDownloadURL(fileSnapshot.ref), getDownloadURL(photoSnapshot.ref)]);
//     const dataToUpdateProfile = {
//       courseId: course._id,
//       psaUrl: filePsa.name,
//       photoUrl: photo.name,
//       goodMoralUrl: fileGoodMoral.name,
//       reportCardUrl: fileTOR.name,
//       studentYear: data.studentYear,
//       studentSemester: data.studentSemester,
//       enrollStatus: 'Pending',
//       // educational background
//       primarySchoolName: data.primarySchoolName,
//       primarySchoolYear: data.primarySchoolYear,
//       secondarySchoolName: data.secondarySchoolName,
//       secondarySchoolYear: data.secondarySchoolYear,
//       seniorHighSchoolName: data.seniorHighSchoolName,
//       seniorHighSchoolYear: data.seniorHighSchoolYear,
//       seniorHighSchoolStrand: data.seniorHighSchoolStrand,
//       // Parent's Information
//       FathersLastName: data.FathersLastName,
//       FathersFirstName: data.FathersFirstName,
//       FathersMiddleName: data.FathersMiddleName,
//       FathersContact: data.FathersContact,
//       MothersLastName: data.MothersLastName,
//       MothersFirstName: data.MothersFirstName,
//       MothersMiddleName: data.MothersMiddleName,
//       MothersContact: data.MothersContact,
//     };
//     const updatedProfile = await StudentProfile.findByIdAndUpdate(getProfile._id, dataToUpdateProfile);
//     if (!updatedProfile) return { message: 'Something went wrong.', status: 500 };
//     return { message: 'hello world success', status: 201 };
//   } catch (error) {
//     console.log(error);
//     return { error: 'hello world error', status: 500 };
//   }
// };

export const createEnrollmentContinuingAction = async (data: any): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const checkEnrollment = await getEnrollmentByUserId(data.userId);
    if (checkEnrollment) return { error: 'You are already Enrolled/Enrolling.', status: 409 };
    const getProfile = await getStudentProfileByUserId(data.userId);
    if (!getProfile) return { error: 'You are enrolling without a profile.', status: 403 };

    data.profileId = getProfile._id;
    data.courseId = getProfile.courseId._id;
    data.onProcess = true;
    data.category = 'College';

    const cc = await createEnrollment(data);
    if (!cc) return { message: 'Something went wrong.', status: 500 };
    /**
     * @todo check if  studentStatus: returning then get all the records and do the logic compare year and semester
     */
    if (data.studentStatus === 'Returning') {
      const record = await getStudentEnrollmentRecordByProfileId(getProfile._id);
      if (!record) return { error: 'No record found', status: 403 };
      if (getProfile.studentSemester === data.studentSemester) {
        return { message: 'Returning student: needs to wait for the next available enrollment period', status: 403 };
      }
    }
    const dataToUpdateProfile = {
      studentYear: data.studentYear,
      studentSemester: data.studentSemester,
      enrollStatus: 'Pending',

      numberStreet: data.numberStreet,
      barangay: data.barangay,
      district: data.district,
      cityMunicipality: data.cityMunicipality,
      province: data.province,
      contact: data.contact,
      civilStatus: data.civilStatus,
    };
    const updatedProfile = await StudentProfile.findByIdAndUpdate(getProfile._id, dataToUpdateProfile);
    if (!updatedProfile) return { message: 'Something went wrong.', status: 500 };

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

export const updateDropSubjectAction = async (data: any) => {
  try {
    await dbConnect();
    const profile = await getStudentProfileById(data.profileId);
    if (!profile) return { error: 'No profile found.', status: 403 };
    const enrollment = await getEnrollmentByProfileId(profile._id);
    if (!enrollment) return { error: 'No enrollment found.', status: 403 };
    // @ts-ignore
    const enrollmentToUpdate = await enrollment.studentSubjects.find((sched: any) => sched._id.toString() === data.studentSubjectId);
    if (!enrollmentToUpdate) {
      return { error: 'No student subject found.', status: 403 };
    }
    enrollmentToUpdate.request = data.request;
    enrollmentToUpdate.requestStatusInDean = 'Pending';
    enrollmentToUpdate.requestStatusInRegistrar = 'Pending';
    enrollmentToUpdate.requestStatus = 'Pending';
    await enrollment.save();
    return { message: `${data.request} subject has been updated.`, status: 201 };
  } catch (error) {
    console.log('server e:', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const updateAddSubjectAction = async (data: any) => {
  try {
    await dbConnect();
    const enrollment = await getEnrollmentById(data.enrollmentId);
    if (!enrollment) return { error: 'Enrollment ID is not valid.', status: 404 };
    for (const item of data.selectedItems) {
      // Find the Teacher Schedule
      const teacherSchedule = await TeacherSchedule.findById(item.teacherScheduleId).populate('blockTypeId');
      if (!teacherSchedule) {
        return { error: `Teacher Schedule ID ${item.teacherScheduleId} is not valid.`, status: 404 };
      }
      // @ts-ignore
      for (const existStudentSched of enrollment.studentSubjects) {
        if (existStudentSched.teacherScheduleId._id.toString() === item.teacherScheduleId) {
          return { error: 'Some Teacher Schedule already exist in the student schedules.', status: 409 };
        }
      }
    }
    /**
     * @todo
     * 1. check conflict time
     */
    const updatedSched = await updateStudentSched(enrollment._id, data);
    if (!updatedSched) return { error: 'Something wrong with updating.', status: 404 };
    return { message: 'Subject created successfully.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

const updateStudentSched = async (blockTypeId: any, data: any) => {
  try {
    await dbConnect();
    const enrollment = await getEnrollmentById(data.enrollmentId);
    if (!enrollment) return { error: 'Enrollment ID is not valid.', status: 404 };
    for (const item of data.selectedItems) {
      await Enrollment.findByIdAndUpdate(
        blockTypeId,
        // @ts-ignore
        { $addToSet: { studentSubjects: { teacherScheduleId: item.teacherScheduleId, profileId: enrollment.profileId._id, status: 'Pending', request: 'add', requestStatusInDean: 'Pending', requestStatusInRegistrar: 'Pending', requestStatus: 'Pending' } } }, // Add teacherScheduleId to blockSubjects
        { new: true }
      );
    }
    return { message: 'Block subjects updated successfully.', status: 200 };
  } catch (error) {
    console.error('Error updating block subjects:', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
