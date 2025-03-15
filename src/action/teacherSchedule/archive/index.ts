'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getBlockTypeByCourseId } from '@/services/blockType';
import { getEnrollmentByCategory } from '@/services/enrollment';
import { getSuperAdminProfileByUserId } from '@/services/superAdminProfile';
import { getTeacherScheduleById, archivedTeacherScheduleById } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

/**
 * handles archived teacher schedule in college action
 *
 * @param {Object} data
 */
export const archiveTeacherScheduleCollegeAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session.user?.role !== 'SUPER ADMIN') return { error: 'Forbidden.', status: 403 };

    const p = await getSuperAdminProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Invalid Profile Id.', status: 404 };

    const isValidScheduleIdObjectId = mongoose.Types.ObjectId.isValid(data.teacherScheduleId);
    if (!isValidScheduleIdObjectId) return { error: `Invalid Schedule Id.`, status: 400 };
    const t = await getTeacherScheduleById(data.teacherScheduleId);
    if (!t) return { error: 'Instructor Schedule not found.', status: 404 };

    let b;
    if (t.courseId) b = await getBlockTypeByCourseId(t.courseId);
    const hasBlockTakenSchedule = b?.some((block) => block.blockSubjects.some((blockSubject: any) => blockSubject.teacherScheduleId._id.toString() === t._id.toString()));
    if (hasBlockTakenSchedule) return { error: 'Instructor Schedule must not used in Blocks to archive.', status: 409 };

    const e = await getEnrollmentByCategory(t.category);
    const hasStudentTakenSchedule = e.some((student) => student.studentSubjects.some((subject: any) => subject.teacherScheduleId._id.toString() === t._id.toString()));

    if (hasStudentTakenSchedule) return { error: 'Instructor Schedule must not used in Student to.', status: 409 };

    const dataToUpdate = { archive: true, archiveBy: p?._id };
    const archivedT = await archivedTeacherScheduleById(t._id, dataToUpdate);
    if (!archivedT) return { error: 'Something went wrong.', status: 500 };

    return { message: 'Schedule has been archived.', category: t?.category, status: 201 };
  });
};
