'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCurriculumByCourseId } from '@/services/curriculum';
import mongoose from 'mongoose';

export const getCurriculumByCourseIdAction = async (courseId: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const isValidObjectId = mongoose.Types.ObjectId.isValid(courseId);
    if (!isValidObjectId) return { error: `Not valid.`, status: 400 };

    const p = await getCurriculumByCourseId(courseId);
    if (!p) return { error: 'Course Curriculum not found', status: 404 };
    return { curriculum: JSON.parse(JSON.stringify(p)), status: 201 };
  });
};
