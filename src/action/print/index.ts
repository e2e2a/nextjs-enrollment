'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { PrintReportValidatorInCollege } from '@/lib/validators/report/dean';
import { getBlockTypeByCourseId, getBlockTypeById, getBlockTypeBySection } from '@/services/blockType';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getEnrollmentByProfileId } from '@/services/enrollment';
import { getAllRoomByEduLevel, getRoomById } from '@/services/room';
import { getStudentProfileByCourseId } from '@/services/studentProfile';
import { getAllTeacherSchedule } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles create subject by category
 *
 * @param {Object} data
 */
export const printReportAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const a = await checkAuthRole(data, session.user);
    if (!a || a.error) return a;

    const parse = PrintReportValidatorInCollege.safeParse(data);
    if (!parse.success) return { error: 'Invalid fields!', status: 400 };

    console.log('parse', parse);
    const b = await checkPrintScope(parse.data, a.courseId);
    // const sConflict = await getSubjectBySubjectCode(data.subjectCode);
    // if (sConflict) return { error: 'Subject Code already Exists.', status: 409 };

    // const dataToCreate = {
    //   ...data,
    //   courseId: p.courseId._id,
    // };

    return { message: 'test successful.', b, status: 200 };
  });
};

const checkAuthRole = async (data: any, user: any) => {
  return tryCatch(async () => {
    let p;
    let courseId;
    switch (user.role) {
      case 'ADMIN':
        p = await getDeanProfileByUserId(user._id);
        break;
      case 'DEAN':
        p = await getDeanProfileByUserId(user._id);
        courseId = p?.courseId?._id;
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    if (!p) return { error: 'User Profile was not found.', status: 404 };
    return { success: 'yesyes', profile: p, courseId, status: 200 };
  });
};

const checkPrintScope = async (data: any, courseId: string) => {
  return tryCatch(async () => {
    let dataToPrint;
    switch (data.selectionScope) {
      case 'All':
        if (data.printSelection === 'Blocks') dataToPrint = await getBlockTypeByCourseId(courseId);
        if (data.printSelection === 'Rooms') dataToPrint = await getAllRoomByEduLevel('Tertiary');
        if (data.printSelection === 'Students') dataToPrint = await getStudentProfileByCourseId(courseId);
        break;
      case 'Individual':
        if (data.printSelection === 'Blocks') dataToPrint = await getBlockTypeBySection(data.individualSelectionId);
        if (data.printSelection === 'Rooms') {
          const room = await getRoomById(data.individualSelectionId);
          const ts = await getAllTeacherSchedule();
          const filteredTs = ts.filter((t) => t.roomId._id.toString() === room._id.toString());
          dataToPrint = { ...room.toObject(), schedules: filteredTs };
        }
        if (data.printSelection === 'Students') dataToPrint = await getEnrollmentByProfileId(data.individualSelectionId);
        break;
      default:
        return { error: 'Forbidden.', dataToPrint, status: 403 };
    }
    return { success: 'yesyes', dataToPrint: JSON.parse(JSON.stringify(dataToPrint)), status: 200 };
  });
};
