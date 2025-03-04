'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Subject from '@/models/Subject';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getSubjectById } from '@/services/subject';
import { checkAuth } from '@/utils/actions/session';

export const archiveSubjectByIdAction = async (id: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session?.user?.role !== 'DEAN') return { error: 'Forbidden', status: 403 };

    const p = await getDeanProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Dean profile not found.', status: 404 };

    const subject = await getSubjectById(id);
    if (!subject) return { error: 'Subject Not found.', status: 404 };

    if (p?.courseId?._id.toString() !== subject?.courseId?._id.toString()) return { error: 'Forbidden', status: 403 };

    const teacherSchedule = await TeacherSchedule.findOne({ subjectId: id }).populate('blockTypeId');
    if (teacherSchedule) return { error: `Subject is used in Instructor Schedule.`, status: 404 };

    const updated = await Subject.findByIdAndUpdate(id, { archive: true, archiveBy: session?.user?._id });
    if (!updated) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Subject has been removed.', id: subject?._id.toString(), category: subject?.category, status: 201 };
  });
};
