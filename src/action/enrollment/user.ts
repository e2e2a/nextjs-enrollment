'use server';
import dbConnect from '@/lib/db/db';
import { getCourseByCourseCode } from '@/services/course';
import { createEnrollment, deleteEnrollmentById, getEnrollmentById, getEnrollmentByUserId } from '@/services/enrollment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getEnrollmentResponse, getSingleEnrollmentResponse, IResponse } from '@/types';

export const createEnrollmentAction = async (data: any): Promise<getEnrollmentResponse> => {
  await dbConnect();
  try {
    const checkEnrollment = await getEnrollmentByUserId(data.userId);
    if (checkEnrollment) return { error: 'You are already Enrolled/Enrolling.', status: 409 };
    const getProfile = await getStudentProfileByUserId(data.userId)
    if (!getProfile) return { error: 'You are enrolling without a course.', status: 403 };
    const course = await getCourseByCourseCode(data.courseCode);
    if (!course) return { error: 'You are enrolling without a course.', status: 403 };
    console.log('course: ' + course)
    delete data.courseCode;
    data.profileId = getProfile.id
    data.courseId = course.id;
    // data.steps = 1;
    data.onProcess = true;
    console.log(`Enrollment`, data);
    /**
     * create a enrollment
     * review the steps
     *
     */

    const cc = await createEnrollment(data);
    if (!cc) return { message: 'Something went wrong.', status: 500 };

    /**
     * @todo
     * create a message notification
     * pop it up
     */
    return { message: 'hello world', status: 201 };
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
    if(e.step != 1) return { error: 'You are deleting with non-existing enrollment.', status: 403 };
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
    return {enrollment: enrollment, status: 200};
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
