'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCurriculumById } from '@/services/curriculum';
import mongoose from 'mongoose';

export const getCurriculumByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) return { error: `Not valid.`, status: 400 };

    const p = await getCurriculumById(id);
    if (!p) return { error: 'Not found', status: 404 };
    return { curriculum: JSON.parse(JSON.stringify(p)), status: 201 };
  });
};
