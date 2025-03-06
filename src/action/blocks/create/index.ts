'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { BlockValidatorInCollege } from '@/lib/validators/block/create/college';
import { createBlockType, getfilterBlockType } from '@/services/blockType';
import { getCourseByCourseCode } from '@/services/course';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * check role
 *
 * @param {object} data
 * @returns create blockType
 */
export const createCollegeCourseBlockAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const blockParse = BlockValidatorInCollege.safeParse(data);
    if (!blockParse.success) return { error: 'Invalid fields!', status: 400 };

    const checkedBlock = await checkBlockType(session.user, blockParse.data);

    return checkedBlock;
  });
};

/**
 * check blockType conflict and store
 *
 * @param {object} data
 */
const checkBlockType = async (user: any, data: any) => {
  return tryCatch(async () => {
    let category = '';
    if (user.role === 'ADMIN') {
      const checkC = await getCourseByCourseCode(data.courseCode);
      if (!checkC) return { error: 'Course not found.', status: 404 };
      delete data.courseCode;
      data.courseId = checkC._id;
      category = checkC.category;
    }

    if (user.role === 'DEAN') {
      const a = await getDeanProfileByUserId(user._id);
      data.courseId = a.courseId._id;
      category = a.courseId.category;
    }

    const checkB = await getfilterBlockType(data);
    if (checkB) return { error: `${data.year}-${data.semester}-Block ${data.section} is already exist in the course.`, status: 500 };

    const p = await createBlockType(data);
    if (!p) return { error: 'Something went wrong in creating block.', status: 500 };

    return { success: true, message: 'Block Type created successfully created', courseId: data.courseId._id.toString(), category: category, status: 201 };
  });
};
