'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Subject from '@/models/Subject';
import { getSubjectById, getSubjectBySubjectCode } from '@/services/subject';
import { getSuperAdminProfileByUserId } from '@/services/superAdminProfile';
import { checkAuth } from '@/utils/actions/session';

export const retrieveSubjectByIdAction = async (id: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session?.user?.role !== 'SUPER ADMIN') return { error: 'Forbidden', status: 403 };

    const p = await getSuperAdminProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Dean profile not found.', status: 404 };

    const subject = await getSubjectById(id);
    if (!subject) return { error: 'Subject Not found.', status: 404 };

    const sConflict = await getSubjectBySubjectCode(subject.subjectCode, p?.courseId?._id || p?.courseId);
    if (sConflict) return { error: 'Subject Code already Exists.', status: 409 };

    const updated = await Subject.findByIdAndUpdate(id, { archive: false }, { new: true });
    if (!updated) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Subject has been retrieved.', id: subject?._id.toString(), category: subject?.category, status: 201 };
  });
};
