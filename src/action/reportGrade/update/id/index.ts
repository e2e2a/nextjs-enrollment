'use server';
import dbConnect from '@/lib/db/db';
import { getReportGradeById } from '@/services/reportGrade';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';

/**
 * handles update report grade by id
 *
 * @param {object} data
 */
export const updateReportGradeAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'TEACHER') return { error: 'Forbidden', status: 403 };

    const category = await checkCategory(session.user, data);
    if (category && category.error) return { error: category.error, status: category.status };

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
    const e = await getReportGradeById(data.reportGradeId);
    const a = await checkType(e.type);

    if (!e) {
      return { error: `You have already report a grade in ${a.message}`, status: 403 };
    } else {
      const p = await checkRole(user, data, e, a.message);
      return p;
    }
  });
};

/**
 * check role
 *
 * @param {object} user
 * @param {object} data
 * @param {object} e
 * @param {string} message
 */
const checkRole = async (user: any, data: any, e: any, message: string) => {
  return tryCatch(async () => {
    switch (user.role) {
      case 'TEACHER':
        return await handleTeacher(user, data, e, message);
      case 'DEAN':
        break;
      case 'ADMIN':
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { success: 'yesyes', status: 200 };
  });
};

/**
 * handle teacher role
 *
 * @param {object} user
 * @param {object} data
 * @param {object} e
 * @param {string} message
 */
const handleTeacher = async (user: any, data: any, e: any, message: string) => {
  return tryCatch(async () => {
    const p = await getTeacherProfileByUserId(user._id);
    if (e.teacherId._id.toString() !== p._id.toString()) return { error: 'Forbidden.', status: 403 };
    switch (data.request) {
      case 'Update':
        e.reportedGrade = data.reportedGrade;
        await e.save();
        return { message: `Grades in ${message} has been updated.`, teacherId: p._id.toString(), category: data.category, status: 201 };
      case 'Trash':
        if (e.statusInDean === 'Approved') return { error: `Cannot Delete Reported Grade Once it's Approved`, status: 403 };
        e.isTrash = true;
        await e.save();
        return { message: `Reported Grades has been deleted.`, teacherId: p._id.toString(), category: data.category, status: 201 };
      default:
        return { error: 'Invalid request.', status: 403 };
    }
  });
};

/**
 * check type && if its open to report a grade
 *
 * @param {string} type
 */
const checkType = async (type: string) => {
  return tryCatch(async () => {
    let message;
    switch (type) {
      case 'firstGrade':
        message = 'Prelim';
        break;
      case 'secondGrade':
        message = 'Midterm';
        break;
      case 'thirdGrade':
        message = 'Semi-final';
        break;
      case 'fourthGrade':
        message = 'Final';
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { success: 'yesyes', message, status: 200 };
  });
};
