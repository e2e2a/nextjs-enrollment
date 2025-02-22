'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { SubjectValidator } from '@/lib/validators/subject/create';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { createNewSubject, getSubjectBySubjectCode } from '@/services/subject';
import { verifyDEAN } from '@/utils/actions/session/roles/dean';

/**
 * handles create subject by category
 *
 * @param {Object} data
 */
export const createNewSubjectAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await verifyDEAN();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const p = await getDeanProfileByUserId(session?.user?._id);
    if (!p) return { error: 'User Data was not found.', status: 404 };

    const subjectParse = SubjectValidator.safeParse(data);
    if (!subjectParse.success) return { error: 'Invalid fields!', status: 400 };

    const sConflict = await getSubjectBySubjectCode(data.subjectCode);
    if (sConflict) return { error: 'Subject Code already Exists.', status: 409 };

    const dataToCreate = {
      ...data,
      courseId: p?.courseId?._id || p?.courseId,
    };

    const createdSubject = await createNewSubject(dataToCreate);
    if (!createdSubject) return { error: 'Something went wrong.', status: 500 };

    return { message: 'Subject created successfully.', category: data.category, status: 201 };
  });
};
