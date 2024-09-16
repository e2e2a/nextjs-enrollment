'use server';
import dbConnect from '@/lib/db/db';
import BlockType from '@/models/BlockType';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getBlockTypeById } from '@/services/blockType';
// import { getAllTeacherSchedule, getTeacherScheduleById } from '@/services/teacherSchedule';

export const updateCourseBlockScheduleAction = async (data: any) => {
  try {
    await dbConnect();
    console.log('recieved data in e:', data);
    const blockType = await getBlockTypeById(data.blockTypeId);
    if (!blockType) return { error: 'Block Type ID is not valid.', status: 404 };
    /**
     * @todo
     */
    for (const item of data.selectedItems) {
      // Find the Teacher Schedule
      const teacherSchedule = await TeacherSchedule.findById(item.teacherScheduleId).populate('blockTypeId');
      if (!teacherSchedule) {
        return { error: `Teacher Schedule ID ${item.teacherScheduleId} is not valid.`, status: 404 };
      }

      // Save the updated Teacher Schedule
      await TeacherSchedule.findByIdAndUpdate(item.teacherScheduleId, { blockTypeId: data.blockTypeId }, { new: true });
    }
    const updatedBlock = await updateBlock(blockType._id, data);
    if (!updatedBlock) return { message: 'Subject created successfully.', status: 404 };
    return { message: 'Subject created successfully.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

const updateBlock = async (blockTypeId: any, data: any) => {
  try {
    await dbConnect();

    // Fetch the BlockType by its ID
    const blockType = await BlockType.findById(blockTypeId);
    if (!blockType) {
      return { error: '', status: 500 };
    }
    // Retrieve all TeacherSchedules
    // const allTeacherSchedules = await TeacherSchedule.find({
    //   blockTypeId: blockTypeId,
    // }).populate('blockTypeId');
    // for (const allTS of allTeacherSchedules) {
    //   let needsUpdate = false;

    //   // Iterate over the schedule within each teacher schedule
    //   if (allTS.blockTypeId && allTS.blockTypeId._id.toString() === blockTypeId.toString()) {
    //     needsUpdate = true;
    //   }

    //   if (needsUpdate) {
    //     await BlockType.findByIdAndUpdate(
    //       blockTypeId, // Update the BlockType document using the blockTypeId
    //       { $addToSet: { blockSubjects: { teacherScheduleId: allTS._id } } }, // Add teacherScheduleId to blockSubjects
    //       { new: true }
    //     );
    //   }
    // }
    for (const item of data.selectedItems) {
      await BlockType.findByIdAndUpdate(
        blockTypeId, // Update the BlockType document using the blockTypeId
        { $addToSet: { blockSubjects: { teacherScheduleId: item.teacherScheduleId } } }, // Add teacherScheduleId to blockSubjects
        { new: true }
      );
    }
    return { message: 'Block subjects updated successfully.', status: 200 };
  } catch (error) {
    console.error('Error updating block subjects:', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

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
    await TeacherSchedule.findByIdAndUpdate(teacherSchedule._id, { blockTypeId: null }, { new: true });

    await BlockType.findByIdAndUpdate(data.blockTypeId, { $pull: { blockSubjects: { teacherScheduleId: teacherSchedule._id } } }, { new: true });
  } catch (error) {
    console.error('Error removing block subjects:', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
