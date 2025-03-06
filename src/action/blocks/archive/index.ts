'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import BlockType from '@/models/BlockType';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getBlockTypeById } from '@/services/blockType';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { checkAuth } from '@/utils/actions/session';

export const archiveBlockTypeAction = async (id: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session?.user?.role !== 'DEAN') return { error: 'Forbidden', status: 403 };

    const p = await getDeanProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Dean profile not found.', status: 404 };

    const blockType = await getBlockTypeById(id);
    if (!blockType) return { error: 'Subject Not found.', status: 404 };

    if (p?.courseId?._id.toString() !== blockType?.courseId?._id.toString()) return { error: 'Forbidden', status: 403 };
    if (blockType?.blockSubjects?.length > 0) return { error: 'Block needs to have a empty schedule to be archive.', status: 403 };

    const teacherSchedule = await TeacherSchedule.findOne({ blockTypeId: id, archive: { $ne: true } }).populate('blockTypeId');
    if (teacherSchedule) return { error: `Blocks must not used in Instructor Schedule to archive.`, status: 404 };

    const updated = await BlockType.findByIdAndUpdate(id, { archive: true, archiveBy: p?._id }, {new: true});
    if (!updated) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Block has been retrieved.', id: blockType?._id.toString(), category: blockType?.category, status: 201 };
  });
};
