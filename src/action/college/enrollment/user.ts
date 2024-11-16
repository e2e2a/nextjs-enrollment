'use server';
import dbConnect from '@/lib/db/db';
import { createEnrollment, deleteEnrollmentById, getEnrollmentById, getEnrollmentByUserId } from '@/services/enrollment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getEnrollmentResponse, IResponse } from '@/types';
import StudentProfile from '@/models/StudentProfile';
import { getEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';
/**
 * this is for continuing student
 * 
 * @param data 
 * @returns 
 */
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

    if (data.studentStatus === 'Returning') {
      const record = await getEnrollmentRecordByProfileId(getProfile._id);
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
