'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCourseByCourseCode } from '@/services/course';
import { getCurriculumByCourseId } from '@/services/curriculum';
import mongoose from 'mongoose';

/**
 * handle query curriculum by courseCode
 *
 * @param {string} courseCode
 */
export const getCurriculumByCourseCodeAction = async (courseCode: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const c = await getCourseByCourseCode(courseCode);
    if (!c) return { error: 'Not found', status: 404 };

    const p = await getCurriculumByCourseId(c._id);
    if (!p) return { error: 'Course Curriculum not found', status: 404 };
    return { curriculum: JSON.parse(JSON.stringify(p)), status: 201 };
  });
};
