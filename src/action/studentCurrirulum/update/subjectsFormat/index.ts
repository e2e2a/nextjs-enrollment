'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import StudentCurriculum from '@/models/StudentCurriculum';
import { getSubjectByCategory } from '@/services/subject';

export const updateStudentCurriculumSubjectsAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const allS = await getSubjectByCategory('College');

    const validSubjectIds = allS.map((subject: any) => subject._id.toString());
    const invalidSubjects = data.subjects.filter((subjectId: string) => !validSubjectIds.includes(subjectId));
    if (invalidSubjects.length > 0) return { error: `Invalid subject(s) found: ${invalidSubjects.join(', ')}`, status: 400 };

    const sc = await StudentCurriculum.findOne({ 'curriculum._id': data.id });
    if (!sc) return { error: 'Student curriculum not found.', status: 404 };

    const curriculumEntry = sc.curriculum.find((c: any) => c._id.toString() === data.id); // Extract existing subjects
    const existingSubjects = curriculumEntry ? curriculumEntry.subjectsFormat : [];

    const existingSubjectIds = existingSubjects.map((sf: any) => sf.subjectId.toString());

    const subjectsToRemove = existingSubjects.filter((sf: any) => !data.subjects.includes(sf.subjectId.toString())).map((sf: any) => sf.subjectId.toString());
    const subjectsToAdd = data.subjects.filter((subjectId: string) => !existingSubjectIds.includes(subjectId)).map((subjectId: string, index: number) => ({ order: existingSubjects.length + index + 1, subjectId: subjectId }));

    if (subjectsToRemove.length > 0) await StudentCurriculum.updateOne({ 'curriculum._id': data.id }, { $pull: { 'curriculum.$.subjectsFormat': { subjectId: { $in: subjectsToRemove } } } });
    if (subjectsToAdd.length > 0) await StudentCurriculum.updateOne({ 'curriculum._id': data.id }, { $push: { 'curriculum.$.subjectsFormat': { $each: subjectsToAdd } } });

    return { message: 'Added Subject to Curriculom Layer.', id: sc._id.toString(), status: 201 };
  });
};
