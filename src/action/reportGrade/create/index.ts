'use server';
import dbConnect from '@/lib/db/db';
import { getEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import { createReportGrade, getReportGradeByDeanId, getReportGradeByTeacherId } from '@/services/reportGrade';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { getDeanProfileByUserId } from '@/services/deanProfile';

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
    if (session.user.role !== 'TEACHER' && session.user.role !== 'DEAN') return { error: 'Forbidden', status: 403 };

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

    const a = await checkType(data.type, data.requestType, ESetup.enrollmentTertiary);
    if (a && a.error) return { error: a.error, status: a.status };

    let p;
    let b;
    switch (user.role) {
      case 'TEACHER':
        p = await getTeacherProfileByUserId(user._id);
        b = await getReportGradeByTeacherId(p._id);
        if (data.requestType === 'Class Report') {
          if (b && b.length > 0) {
            const e = b.filter((e) => e.teacherScheduleId._id.toString() === data.teacherScheduleId && e.type === data.type && e.requestType === 'Class Report');
            if (e && e.length > 0) {
              return { error: `You have already report a grade in ${a.message}`, status: 409 };
            }
          }
        }
        if (data.requestType === 'Individual') {
          if (b && b.length > 0) {
            const e = b.filter((e) => e.teacherScheduleId._id.toString() === data.teacherScheduleId && e.type === data.type && e.requestType === 'Individual');

            if (e && e.length > 0) {
              for (const student of e[0].reportedGrade) {
                if (student.profileId && student.profileId._id.toString() === data.reportedGrade[0].profileId) {
                  return { error: `You have already reported a grade for this student in ${a.message}`, status: 409 };
                }
              }
              return { error: `You have already reported a grade in ${a.message}`, status: 409 };
            }
          }
        }

        break;
      case 'DEAN':
        p = await getDeanProfileByUserId(user._id);
        b = await getReportGradeByDeanId(p._id);
        if (data.requestType === 'Class Report') {
          if (b && b.length > 0) {
            const e = b.filter((e) => e.teacherScheduleId._id.toString() === data.teacherScheduleId && e.type === data.type && e.requestType === 'Class Report');
            if (e && e.length > 0) {
              return { error: `You have already report a grade in ${a.message}`, status: 409 };
            }
          }
        }
        if (data.requestType === 'Individual') {
          if (b && b.length > 0) {
            const e = b.filter((e) => e.teacherScheduleId._id.toString() === data.teacherScheduleId && e.type === data.type && e.requestType === 'Individual');

            if (e && e.length > 0) {
              for (const student of e[0].reportedGrade) {
                if (student.profileId && student.profileId._id.toString() === data.reportedGrade[0].profileId) {
                  return { error: `You have already reported a grade for this student in ${a.message}`, status: 409 };
                }
              }
              return { error: `You have already reported a grade in ${a.message}`, status: 409 };
            }
          }
        }
        break;
      default:
        return { error: 'Forbidden', status: 403 };
    }

    if (user.role === 'TEACHER') data.teacherId = p._id;
    if (user.role === 'DEAN') data.deanId = p._id;
    data.statusInDean = 'Pending';
    data.evaluated = false;
    data.schoolYear = ESetup.enrollmentTertiary.schoolYear;

    data.reportedGrade.map((e: any) => {
      if (!e.grade || e.grade === undefined || e.grade === null) {
        e.grade = 'INC';
      } else if (e.grade.toLowerCase() !== 'INC'.toLowerCase()) {
        e.grade = Number(e.grade).toFixed(2);
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
 * @param {requestType} type
 * @param {object} ESetup
 */
const checkType = async (type: string, requestType: string, ESetup: any) => {
  return tryCatch(async () => {
    let message;
    switch (type) {
      case 'firstGrade':
        message = 'Prelim';
        if (!ESetup.firstGrade.open && requestType === 'Class Report') return { error: 'Reporting Grade for Prelim is closed.', status: 404 };
        break;
      case 'secondGrade':
        message = 'Midterm';
        if (!ESetup.secondGrade.open && requestType === 'Class Report') return { error: 'Reporting Grade for Midterm is closed.', status: 404 };
        break;
      case 'thirdGrade':
        message = 'Semi-final';
        if (!ESetup.thirdGrade.open && requestType === 'Class Report') return { error: 'Reporting Grade for Semi-final is closed.', status: 404 };
        break;
      case 'fourthGrade':
        message = 'Final';
        if (!ESetup.fourthGrade.open && requestType === 'Class Report') return { error: 'Reporting Grade for Final is closed.', status: 404 };
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { success: 'yesyes', message, status: 200 };
  });
};
