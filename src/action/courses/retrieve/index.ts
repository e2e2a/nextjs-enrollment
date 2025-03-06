'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Course from '@/models/Course';
import { getCourseByCourseCode, getCourseByName, getCoursesById } from '@/services/course';
import { getSuperAdminProfileByUserId } from '@/services/superAdminProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles retrieve Course in college action
 *
 * @param {string} id
 */
export const retrieveCourseAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session.user.role !== 'SUPER ADMIN') return { error: 'Forbidden', status: 403 };

    const p = await getSuperAdminProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Profile not found', status: 404 };

    const course = await getCoursesById(id);
    if (!course) return { error: 'Course ID is not valid.', status: 404 };

    const checkCourseCode = await getCourseByCourseCode(course.courseCode);
    if (checkCourseCode) return { error: 'Course code already exist.', status: 409 };

    const checkName = await getCourseByName(course.name);
    if (checkName) return { error: 'Course name already exist.', status: 409 };

    const updated = await Course.findByIdAndUpdate(course._id, { archive: false }, { new: true });
    if (!updated) return { error: 'Something went wrong', status: 500 };

    return { message: `Course has been retrieved.`, id: course?._id.toString(), category: course?.category, status: 201 };
  });
};
