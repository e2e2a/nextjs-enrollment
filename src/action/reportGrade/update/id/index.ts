'use server';
import dbConnect from '@/lib/db/db';
import { getReportGradeById } from '@/services/reportGrade';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getEnrollmentByProfileId } from '@/services/enrollment';

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
    const e = await getReportGradeById(data.reportGradeId);
    if (!e) return { error: `No Report Grade Found. `, status: 404 };

    const a = await checkType(e.type);
    const p = await checkRole(user, data, e, a.message);

    return p;
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
        return await handleDean(user, data, e, message);
      case 'ADMIN':
        return await handleAdmin(user, data, e, message);
      default:
        return { error: 'Forbidden.', status: 403 };
    }
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
        return { message: `Grades in ${message} has been updated.`, teacherId: p._id.toString(), category: data.category, id: e._id.toString(), status: 201 };
      case 'Trash':
        if (e.statusInDean === 'Approved') return { error: `Cannot Delete Reported Grade Once it's Approved`, status: 403 };
        e.isTrash = true;
        await e.save();
        return { message: `Reported Grades has been deleted.`, teacherId: p._id.toString(), category: data.category, id: e._id.toString(), status: 201 };
      default:
        return { error: 'Invalid request.', status: 403 };
    }
  });
};

/**
 * handle dean role
 *
 * @param {object} user
 * @param {object} data
 * @param {object} e
 * @param {string} message
 */
const handleDean = async (user: any, data: any, e: any, message: string) => {
  return tryCatch(async () => {
    const p = await getDeanProfileByUserId(user._id);
    if (e.teacherScheduleId.courseId._id.toString() !== p.courseId._id.toString()) return { error: 'Forbiddenaa.', status: 403 };
    if (e.evaluated === true) return { error: 'The reported grade has already been evaluated.', status: 401 };
    if (e.statusInDean === data.statusInDean) return { error: `Reported grades has already been ${data.statusInDean}`, status: 403 };
    e.statusInDean = data.statusInDean;
    await e.save();

    return { message: `Grades in ${message} has been ${data.statusInDean}.`, teacherId: e.teacherId._id.toString(), category: data.category, id: e._id.toString(), status: 201 };
  });
};

/**
 * handle dean role
 *
 * @param {object} user
 * @param {object} data
 * @param {object} e
 * @param {string} message
 */
const handleAdmin = async (user: any, data: any, e: any, message: string) => {
  return tryCatch(async () => {
    for (const rg of e.reportedGrade) {
      const se = await getEnrollmentByProfileId(rg.profileId._id);
      if (se && se.studentSubjects.length > 0) {
        const filteredSubjects = se.studentSubjects.filter((subject: any) => {
          return subject.teacherScheduleId._id.toString() === e.teacherScheduleId._id.toString();
        });

        let gradeField = '';

        if (e.type === 'firstGrade') {
          gradeField = 'firstGrade';
        } else if (e.type === 'secondGrade') {
          gradeField = 'secondGrade';
        } else if (e.type === 'thirdGrade') {
          gradeField = 'thirdGrade';
        } else if (e.type === 'fourthGrade') {
          gradeField = 'fourthGrade';
        }

        for (const subject of filteredSubjects) {
          subject[gradeField] = rg.grade;
          if (e.type === 'fourthGrade') {
            const grades = [Number(subject.firstGrade), Number(subject.secondGrade), Number(subject.thirdGrade), Number(subject.fourthGrade)].filter((grade) => !isNaN(grade));
            if (grades.length > 3) {
              subject.averageTotal = parseFloat((grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(2));
            }
          }

          await se.save();
        }
      }
    }
    e.evaluated = true;
    await e.save();
    return { message: `Reported Grades in ${message} has been Evaluated.`, teacherId: e.teacherId._id.toString(), teacherScheduleId: e.teacherScheduleId._id.toString(), category: data.category, id: e._id.toString(), status: 201 };
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
