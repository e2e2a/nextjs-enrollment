'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getEnrollmentByCategory } from '@/services/enrollment';
import { verifyDEAN } from '@/utils/actions/session/roles/dean';

/**
 * handles query enrollment and filtered by courseId
 * only dean roles
 *
 * @param {string} courseId
 */
export const getAllEnrollmentByCourseIdAction = async (courseId: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await verifyDEAN();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const s = await getStudent(session.user._id, courseId);

    return s;
  });
};

/**
 * get student by courseId
 *
 * @param {string} id
 * @param {string} courseId
 */
const getStudent = async (id: string, courseId: string) => {
  return tryCatch(async () => {
    const profile = await getDeanProfileByUserId(id);
    if (!profile) return { error: 'No Profile found.', status: 404 };
    if (courseId !== profile.courseId._id.toString()) return { error: 'Forbidden', status: 403 };

    const e = await getEnrollmentByCategory(profile.courseId.category);

    const filteredStudents = e?.filter((s) => s.courseId._id.toString() === courseId);
    return { students: JSON.parse(JSON.stringify(filteredStudents)), status: 200 };
  });
};
