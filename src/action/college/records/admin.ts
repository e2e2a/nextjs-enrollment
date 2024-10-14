'use server';
import dbConnect from '@/lib/db/db';
import { getAllStudentEnrollmentRecordByCollege, getStudentEnrollmentRecordById, getStudentEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';
import { getAllTeacherScheduleRecordByCollege, getTeacherScheduleRecordById, getTeacherScheduleRecordByProfileId } from '@/services/teacherScheduleRecord';

export const getAllTeacherScheduleRecordByCollegeAction = async (category: string): Promise<any> => {
  try {
    await dbConnect();
    const teacherScheduleRecords = await getAllTeacherScheduleRecordByCollege(category);
    return { teacherScheduleRecords: JSON.parse(JSON.stringify(teacherScheduleRecords)), status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
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
export const getAllStudentEnrollmentRecordCollegeAction = async (category: string): Promise<any> => {
  try {
    await dbConnect();
    const enrollmentRecords = await getAllStudentEnrollmentRecordByCollege(category);
    return { enrollmentRecords: JSON.parse(JSON.stringify(enrollmentRecords)), status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

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
    if (!enrollmentRecord) return { error: 'wala error lang.', status: 404 };
    return { enrollmentRecord: JSON.parse(JSON.stringify(enrollmentRecord)), status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
