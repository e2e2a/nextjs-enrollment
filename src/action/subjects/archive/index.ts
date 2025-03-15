'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Subject from '@/models/Subject';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getSubjectById } from '@/services/subject';
import { getSuperAdminProfileByUserId } from '@/services/superAdminProfile';
import { checkAuth } from '@/utils/actions/session';

export const archiveSubjectByIdAction = async (id: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session?.user?.role !== 'SUPER ADMIN') return { error: 'Forbidden', status: 403 };

    const p = await getSuperAdminProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Super Admin profile not found.', status: 404 };

    const subject = await getSubjectById(id);
    if (!subject) return { error: 'Subject Not found.', status: 404 };

    const teacherSchedule = await TeacherSchedule.findOne({ subjectId: id });
    if (teacherSchedule) return { error: `Subject must not used in Instructor Schedule to archive.`, status: 404 };

    const updated = await Subject.findByIdAndUpdate(id, { archive: true, archiveBy: p?._id });
    if (!updated) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Subject has been archived.', id: subject?._id.toString(), category: subject?.category, status: 201 };
  });
};
