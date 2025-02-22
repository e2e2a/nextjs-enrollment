'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { SubjectValidator } from '@/lib/validators/subject/create';
import Subject from '@/models/Subject';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getSubjectBySubjectCode } from '@/services/subject';
import { checkAuth } from '@/utils/actions/session';
import { verifyADMIN } from '@/utils/actions/session/roles/admin';
import { verifyDEAN } from '@/utils/actions/session/roles/dean';
import { Types } from 'mongoose';

/**
 * handles create update by id
 *
 * @param {Object} data
 */
export const updateSubjectByIdAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const a = await checkCategory(session.user, data);
    return a;
  });
};

/**
 * handles check request by category
 *
 * @param {Object} data
 * @param {Object} user
 */
const checkCategory = async (user: any, data: any) => {
  return tryCatch(async () => {
    let category;
    switch (data.category) {
      case 'College':
        category = await categoryCollege(user, data);
        break;
      default:
        return { error: 'Invalid category.', status: 400 };
    }

    return category;
  });
};

/**
 * handles college category
 *
 * @param {Object} data
 * @param {Object} user
 */
const categoryCollege = async (user: any, data: any) => {
  return tryCatch(async () => {
    const session = await verifyDEAN();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const p = await getDeanProfileByUserId(session?.user?._id);
    if (!p) return { error: 'User Data was not found.', status: 404 };
    const isValidObjectId = Types.ObjectId.isValid(data.id);
    if (!isValidObjectId) return { error: `Not valid.`, status: 400 };

    const subjectParse = SubjectValidator.safeParse(data);
    if (!subjectParse.success) return { error: 'Invalid fields!', status: 400 };

    const subject = await Subject.findById(data.id);
    if (!subject) return { error: 'Subject not found!', status: 404 };

    if (subject.subjectCode !== data.subjectCode) {
      const sConflict = await getSubjectBySubjectCode(data.subjectCode, p?.courseId?._id || p?.courseId);
      if (sConflict) return { error: 'Subject Code already Exists.', status: 409 };
    }

    const updated = await Subject.findByIdAndUpdate(data.id, { ...subjectParse.data });
    if (!updated) return { error: 'Something went wrong.', status: 500 };

    return { message: 'Subject updated successfully.', id: data.id, category: data.category, status: 201 };
  });
};
