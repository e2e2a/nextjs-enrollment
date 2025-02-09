'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import StudentCurriculum from '@/models/StudentCurriculum';
import { getStudentCurriculumById } from '@/services/studentCurriculum';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

/**
 * handles update action
 *
 * @param {object} data
 */
export const updateStudentCurriculumLayerAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN' && session.user.role !== 'DEAN') return { error: 'Forbidden.', status: 403 };

    const a = await updateLayer(data);
    return a;
  });
};

/**
 * handles storing
 *
 * @param {object} data
 */
const updateLayer = async (data: any) => {
  return tryCatch(async () => {
    const { CId, year, semester, order, schoolYear } = data;

    const a = await checkConflicts(data);
    if (a && a.error) return { error: a.error, status: a.status };

    const p = await StudentCurriculum.findByIdAndUpdate(CId, { $push: { curriculum: { order, year, semester, schoolYear } } }, { new: true });
    return a;
  });
};

/**
 * handles check conflicts
 *
 * @param {object} data
 */
const checkConflicts = async (data: any) => {
  return tryCatch(async () => {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(data.CId);
    if (!isValidObjectId) return { error: `Forbiddena.`, status: 403 };

    const c = await getStudentCurriculumById(data.CId);
    if (!c) return { error: 'Invalid id for Curriculom', status: 404 };

    if (c.curriculum && c.curriculum.length > 0) {
      const conflictExists = c.curriculum.some((entry: any) => entry.year === data.year && entry.semester === data.semester);
      if (conflictExists) return { error: `Conflict: (${data.year})-(${data.semester}) has been already exist.`, status: 409 };

      // Check for conflicts in order
      const conflictOrderExists = c.curriculum.some((entry: any) => entry.order === data.order);
      if (conflictOrderExists) return { error: `Conflict: Order ${data.order} is already occupied, choose another order number.`, status: 409 };
    }
    return { success: true, message: `${data.year}-${data.semester} has been added.`, id: c._id.toString(), category: data.category, status: 201 };
  });
};
