'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import BlockType from '@/models/BlockType';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getBlockTypeById } from '@/services/blockType';
import mongoose from 'mongoose';

export const updateCourseBlockScheduleAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const blockType = await getBlockTypeById(data.blockTypeId);
    if (!blockType) return { error: 'Block Type ID is not valid.', status: 404 };

    const checkedTeach = await checkTeacherAndSave(blockType, data);
    if (checkedTeach && checkedTeach.error) return { error: checkedTeach.error, status: checkedTeach.status };

    const updatedBlock = await updateBlock(blockType._id, data);
    if (updatedBlock && updatedBlock.error) return { error: updatedBlock.error, status: 404 };

    return { message: `Schedule added to Block ${blockType.section.toUpperCase()}.`, status: 201 };
  });
};

const checkTeacherAndSave = async (blockType: any, data: any) => {
  return tryCatch(async () => {
    const checkedTeachId = await checkTeacherScheduleId(data, blockType);
    if (checkedTeachId && checkedTeachId.error) return { error: checkedTeachId.error, status: checkedTeachId.status };

    const idsToUpdate = data.selectedItems.map((item: any) => item.teacherScheduleId.toString());
    await TeacherSchedule.updateMany(
      { _id: { $in: idsToUpdate } },
      {
        $set: {
          blockTypeId: data.blockTypeId,
          courseId: blockType.courseId._id,
        },
      }
    );
    return { success: 'Updated Successfully.', status: 201 };
  });
};


const updateBlock = async (blockTypeId: any, data: any) => {
  return tryCatch(async () => {
    const bulkOperations = data.selectedItems.map((item: any) => ({
      updateOne: {
        filter: { _id: blockTypeId },
        update: { $addToSet: { blockSubjects: { teacherScheduleId: item.teacherScheduleId } } }
      }
    }));

    const result = await BlockType.bulkWrite(bulkOperations);

    return { message: 'New Schedule has been added.', status: 200 };
  });
};

const checkTeacherScheduleId = async (data: any, blockType: any) => {
  return tryCatch(async () => {
    for (const item of data.selectedItems) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(item.teacherScheduleId);
      if (!isValidObjectId) return { error: `Teacher Schedule ID ${item.teacherScheduleId} is not valid.`, status: 404 };
    }

    if (blockType && blockType.blockSubjects.length > 0) {
      for (const schedule of blockType.blockSubjects) {
        const existingDays = schedule.teacherScheduleId.days;
        const [existingStartHours, existingStartMinutes] = schedule.teacherScheduleId.startTime.split(':').map(Number);
        const [existingEndHours, existingEndMinutes] = schedule.teacherScheduleId.endTime.split(':').map(Number);
        for (const item of data.selectedItems) {
          const teacherSchedule = await TeacherSchedule.findById(item.teacherScheduleId).exec();
          const [newStartHours, newStartMinutes] = teacherSchedule.startTime.split(':').map(Number);
          const [newEndHours, newEndMinutes] = teacherSchedule.endTime.split(':').map(Number);
          const isDayOverlap = teacherSchedule.days.some((day: string) => existingDays.includes(day)); // Check if any days overlap
          if (isDayOverlap) {
            const isTimeOverlap =
              (newStartHours < existingEndHours || (newStartHours === existingEndHours && newStartMinutes < existingEndMinutes)) && (newEndHours > existingStartHours || (newEndHours === existingStartHours && newEndMinutes > existingStartMinutes));

            if (isTimeOverlap) {
              return { error: `Block Schedule conflict Time:${teacherSchedule.startTime}-${teacherSchedule.endTime}.`, errorInsLink: `${teacherSchedule._id}`, status: 409 };
            }
          }
        }
      }
    }
  });
};