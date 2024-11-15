'use server';
import dbConnect from '@/lib/db/db';
import { getEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import { createReportGrade, getReportGradeByTeacherId } from '@/services/reportGrade';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';

/**
 * handles create report grade
 *
 * @param {object} data
 */
export const createReportGradeAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'TEACHER') return { error: 'Forbidden', status: 403 };

    const category = await checkCategory(session.user, data);

    return category;
  });
};

/**
 * check category
 *
 * @param {object} data
 */
const checkCategory = async (user: any, data: any) => {
  return tryCatch(async () => {
    let p;
    switch (data.category) {
      case 'College':
        p = await handleCollege(user, data);
        break;
      case '2':
        // for other categories
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return p;
  });
};

/**
 * handles Category College
 *
 * @param {object} data
 */
const handleCollege = async (user: any, data: any) => {
  return tryCatch(async () => {
    const ESetup = await getEnrollmentSetupByName('GODOY');

    const a = await checkType(data.type, ESetup.enrollmentTertiary);
    if (a && a.error) return { error: a.error, status: a.status };

    const p = await getTeacherProfileByUserId(user._id);

    const b = await getReportGradeByTeacherId(p._id);
    if (b && b.length > 0) {
      const e = b.filter((e) => e.teacherScheduleId._id.toString() === data.teacherScheduleId && e.type === data.type);
      if (e && e.length > 0) {
        return { error: `You have already report a grade in ${a.message}`, status: 409 };
      }
    }

    data.teacherId = p._id;
    data.statusInDean = 'Pending';
    data.evaluated = false;
    data.schoolYear = ESetup.enrollmentTertiary.schoolYear;

    data.reportedGrade.map((e: any) => {
      if (!e.grade || e.grade === undefined || e.grade === null) {
        e.grade = 5.0;
      }
    });

    const createdReportGrade = await createReportGrade(data);
    if (!createdReportGrade) return { error: 'Something went wrong.', status: 500 };
    return { success: true, message: `Grade Report in ${a.message} has been created.`, teacherId: p._id.toString(), category: data.category, status: 201 };
  });
};

/**
 * check type && if its open to report a grade
 *
 * @param {string} type
 * @param {object} ESetup
 */
const checkType = async (type: string, ESetup: any) => {
  return tryCatch(async () => {
    let message;
    switch (type) {
      case 'firstGrade':
        message = 'Prelim';
        if (!ESetup.firstGrade.open) return { error: 'Reporting Grade for Prelim is closed.', status: 404 };
        break;
      case 'secondGrade':
        message = 'Midterm';
        if (!ESetup.secondGrade.open) return { error: 'Reporting Grade for Midterm is closed.', status: 404 };
        break;
      case 'thirdGrade':
        message = 'Semi-final';
        if (!ESetup.thirdGrade.open) return { error: 'Reporting Grade for Semi-final is closed.', status: 404 };
        break;
      case 'fourthGrade':
        message = 'Final';
        if (!ESetup.fourthGrade.open) return { error: 'Reporting Grade for Final is closed.', status: 404 };
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { success: 'yesyes', message, status: 200 };
  });
};
