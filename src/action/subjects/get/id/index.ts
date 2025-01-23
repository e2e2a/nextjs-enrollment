'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Subject from '@/models/Subject';

/**
 * handles query subject by category
 *
 * @param {string} id
 */
export const getSubjectByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const subject = await Subject.findById(id);

    return { subject: JSON.parse(JSON.stringify(subject)), status: 201 };
  });
};
