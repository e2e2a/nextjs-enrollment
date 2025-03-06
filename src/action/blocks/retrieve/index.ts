'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import BlockType from '@/models/BlockType';
import { getBlockTypeById, getfilterBlockType } from '@/services/blockType';
import { getSuperAdminProfileByUserId } from '@/services/superAdminProfile';
import { checkAuth } from '@/utils/actions/session';

export const retrieveBlockTypeAction = async (id: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session?.user?.role !== 'SUPER ADMIN') return { error: 'Forbidden', status: 403 };

    const p = await getSuperAdminProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Dean profile not found.', status: 404 };

    const blockType = await getBlockTypeById(id);
    if (!blockType) return { error: 'Subject Not found.', status: 404 };

    const data = { courseId: blockType.courseId, section: blockType.section, semester: blockType.semester, blockType: blockType.year };

    const checkB = await getfilterBlockType(data);
    if (checkB) return { error: `${blockType.year}-${blockType.semester}-Block ${blockType.section} is already exist in the course.`, status: 500 };

    const updated = await BlockType.findByIdAndUpdate(id, { archive: false }, { new: true });
    if (!updated) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Block has been retrieved.', id: blockType?._id.toString(), category: blockType?.category, status: 201 };
  });
};
