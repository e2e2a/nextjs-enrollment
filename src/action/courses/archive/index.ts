'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import BlockType from '@/models/BlockType';
import Course from '@/models/Course';
import { getCoursesById } from '@/services/course';
import { getSuperAdminProfileByUserId } from '@/services/superAdminProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles archived Course in college action
 *
 * @param {string} id
 */
export const archiveCourseAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session.user.role !== 'SUPER ADMIN') return { error: 'Forbidden', status: 403 };

    const p = await getSuperAdminProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Profile not found', status: 404 };

    const course = await getCoursesById(id);
    if (!course) return { error: 'Course ID is not valid.', status: 404 };

    const blockTypes = await BlockType.find().populate('courseId');

    if (blockTypes.length > 0) {
      const hasStudentTakenSchedule = blockTypes.some((b) => b?.courseId?._id.toString() === course?._id.toString());
      if (hasStudentTakenSchedule) return { error: 'Course must have an empty blocks to archive.', status: 409 };
    }

    const updated = await Course.findByIdAndUpdate(course._id, { archive: true, archiveBy: p?._id }, { new: true });
    if (!updated) return { error: 'Something went wrong', status: 500 };

    return { message: `Course has been archived.`, id: course?._id.toString(), category: course?.category, status: 201 };
  });
};
