'use server';
import dbConnect from '@/lib/db/db';
import { getStudentEnrollmentRecordById, getStudentEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';
import { getTeacherScheduleRecordById, getTeacherScheduleRecordByProfileId } from '@/services/teacherScheduleRecord';

export const getTeacherScheduleRecordByProfileIdAction = async (id: any): Promise<any> => {
  try {
    await dbConnect();
    const teacherScheduleRecord = await getTeacherScheduleRecordByProfileId(id);
    return { teacherScheduleRecord: JSON.parse(JSON.stringify(teacherScheduleRecord)), status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getTeacherScheduleRecordByIdAction = async (id: any): Promise<any> => {
  try {
    await dbConnect();
    const teacherScheduleRecord = await getTeacherScheduleRecordById(id);
    return { teacherScheduleRecord: JSON.parse(JSON.stringify(teacherScheduleRecord)), status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

/**
 * students records action
 * @returns
 */
export const getStudentEnrollmentRecordByProfileIdAction = async (id: any): Promise<any> => {
  try {
    await dbConnect();
    const enrollmentRecord = await getStudentEnrollmentRecordByProfileId(id);
    return { enrollmentRecord: JSON.parse(JSON.stringify(enrollmentRecord)), status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getStudentEnrollmentRecordByIdAction = async (id: any): Promise<any> => {
  try {
    await dbConnect();
    const enrollmentRecord = await getStudentEnrollmentRecordById(id);
    if(!enrollmentRecord) return{error: 'wala error lang.', status: 404}
    return { enrollmentRecord: JSON.parse(JSON.stringify(enrollmentRecord)), status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};