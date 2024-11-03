'use server';
import dbConnect from '@/lib/db/db';
import BlockType from '@/models/BlockType';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getBlockTypeById } from '@/services/blockType';

/**
 * 
 * @note
 * hard to transfer this one because we still have a super admin role which is needed to make a boolean for trash
 */ 
export const removeCourseBlockScheduleAction = async (data: any) => {
  try {
    await dbConnect();
    const blockType = await getBlockTypeById(data.blockTypeId);
    if (!blockType) return { error: 'Block Type ID is not valid.', status: 404 };
    /**
     * @todo
     */
    // Find the Teacher Schedule
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) {
      return { error: `Teacher Schedule ID is not valid.`, status: 404 };
    }
    // Save the updated Teacher Schedule
    await TeacherSchedule.findByIdAndUpdate(teacherSchedule._id, { blockTypeId: null, courseId: null }, { new: true });

    await BlockType.findByIdAndUpdate(data.blockTypeId, { $pull: { blockSubjects: { teacherScheduleId: teacherSchedule._id } } }, { new: true });
    return { message: `Schedule has been removed.`, status: 201 };
  } catch (error) {
    console.error('Error removing block subjects:', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
