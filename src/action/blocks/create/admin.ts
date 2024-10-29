import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { BlockValidatorInCollege } from '@/lib/validators/block/create/college';
import { createBlockType, getfilterBlockType } from '@/services/blockType';
import { getCourseByCourseCode } from '@/services/course';

/**
 * check role
 *
 * @param {object} data
 * @returns create blockType
 */
export const createCollegeCourseBlockAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    // must have a condition for admin roles
    // for now empty
    const blockParse = BlockValidatorInCollege.safeParse(data);
    if (!blockParse.success) return { error: 'Invalid fields!', status: 400 };

    const checkedBlock = await checkBlockType(blockParse.data);
    if (checkedBlock && checkedBlock.error) return { error: checkedBlock.error, status: checkedBlock.status };

    return { message: 'Block Type created successfully created', status: 201 };
  });
};

/**
 * check blockType conflict and store
 *
 * @param {object} data
 */
const checkBlockType = async (data: any) => {
  return tryCatch(async () => {
    const checkC = await getCourseByCourseCode(data.courseCode);
    if (!checkC) return { error: 'Course not found.', status: 404 };
    delete data.courseCode;
    data.courseId = checkC._id;

    const checkB = await getfilterBlockType(data);
    if (checkB) return { error: `${data.year}-${data.semester}-Block ${data.section} is already exist in the course.`, status: 500 };

    const p = await createBlockType(data);
    if (!p) return { error: 'Something went wrong in creating block.', status: 500 };

    return { success: 'yesyes', status: 201 };
  });
};
