'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getBlockTypeByCourseId } from '@/services/blockType';
import { getDeanProfileById } from '@/services/deanProfile';
import { getEnrollmentByCategory } from '@/services/enrollment';
import { getTeacherProfileById } from '@/services/teacherProfile';
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

    const isValidProfileIdObjectId = mongoose.Types.ObjectId.isValid(data.profileId);
    const isValidDeanIdObjectId = mongoose.Types.ObjectId.isValid(data.deanId);
    if (!isValidProfileIdObjectId && !isValidDeanIdObjectId) return { error: `User information Not valid.`, status: 400 };

    let p;
    if (data.profileId) p = await getTeacherProfileById(data.profileId);
    if (data.deanId) p = await getDeanProfileById(data.deanId);
    if (!p) return { error: 'Invalid Profile Id.', status: 404 };

    const t = await getTeacherScheduleById(data.teacherScheduleId);
    if (!t) return { error: 'Invalid Schedule Id.', status: 404 };

    let b;
    if (t.courseId) b = await getBlockTypeByCourseId(t.courseId);
    const hasBlockTakenSchedule = b?.some((block) => block.blockSubjects.some((blockSubject: any) => blockSubject.teacherScheduleId._id.toString() === t._id.toString()));
    if (hasBlockTakenSchedule) return { error: 'Blocks has already taken this Instructor Schedule.', status: 409 };

    const e = await getEnrollmentByCategory(t.category);
    const hasStudentTakenSchedule = e.some((student) => student.studentSubjects.some((subject: any) => subject.teacherScheduleId._id.toString() === t._id.toString()));

    if (hasStudentTakenSchedule) return { error: 'Student has already taken this Instructor Schedule.', status: 409 };

    const dataToUpdate = { archive: true, archiveBy: session.user._id };

    const archivedT = await archivedTeacherScheduleById(t._id, dataToUpdate);
    if (!archivedT) return { error: 'Something went wrong.', status: 500 };

    return { message: 'Schedule has been removed.', category: t?.category, status: 201 };
  });
};
