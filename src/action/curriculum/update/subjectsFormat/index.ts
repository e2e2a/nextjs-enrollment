'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Curriculum from '@/models/Curriculum';
import { getSubjectByCategory } from '@/services/subject';
import { checkAuth } from '@/utils/actions/session';

/**
 * handle update curriculum layer
 *
 * @param {object} data
 */
export const updateCurriculumSubjectsAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN') return { error: 'Forbidden.', status: 403 };
    if (data.subjects.length === 0) return { error: 'No subjects to update.', status: 400 };

    const allS = await getSubjectByCategory('College');
    const validSubjectIds = allS.map((subject: any) => subject._id.toString());

    const invalidSubjects = data.subjects.filter((subjectId: string) => !validSubjectIds.includes(subjectId));
    if (invalidSubjects.length > 0) return { error: `Invalid subject(s) found: ${invalidSubjects.join(', ')}`, status: 400 };

    const newCurriculumEntry = data.subjects.map((subject: any, index: number) => ({ order: index + 1, subjectId: subject }));

    await Curriculum.updateOne({ 'curriculum._id': data.id }, { $set: { 'curriculum.$.subjectsFormat': [] } }); // Clear existing entries
    const a = await Curriculum.findOneAndUpdate({ 'curriculum._id': data.id }, { $push: { 'curriculum.$.subjectsFormat': { $each: newCurriculumEntry } } }, { new: true }); // Add new entries

    return { message: `Subjects has been updated.`, category: data.category, id: a._id.toString(), status: 201 };
  });
};
