'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import BlockType from '@/models/BlockType';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getBlockTypeById } from '@/services/blockType';
import { getEnrollmentByCategory } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles archived Block schedule in college action
 *
 * @param {Object} data
 */
export const archiveCourseBlockScheduleAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const blockType = await getBlockTypeById(data.blockTypeId);
    if (!blockType) return { error: 'Block Type ID is not valid.', status: 404 };

    // Find the Teacher Schedule
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) {
      return { error: `Teacher Schedule ID is not valid.`, status: 404 };
    }

    const e = await getEnrollmentByCategory(teacherSchedule.category);
    const hasStudentTakenSchedule = e.some((student) => student.studentSubjects.some((subject: any) => subject.teacherScheduleId._id.toString() === teacherSchedule._id.toString()));

    if (hasStudentTakenSchedule) return { error: 'Student has already taken this Instructor Schedule.', status: 409 };

    // Save the updated Teacher Schedule
    await TeacherSchedule.findByIdAndUpdate(teacherSchedule._id, { blockTypeId: null, courseId: null }, { new: true });
    await BlockType.findByIdAndUpdate(data.blockTypeId, { $pull: { blockSubjects: { teacherScheduleId: teacherSchedule._id } } }, { new: true });
    return { message: `Schedule has been removed.`, category: teacherSchedule?.category, id: blockType?._id.toString(), courseId: blockType?.courseId?._id.toString(), profileId: teacherSchedule?.profileId?._id.toString(), status: 201 };
  });
};
