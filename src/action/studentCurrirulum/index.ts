'use server';
import dbConnect from '@/lib/db/db';
import StudentCurriculum from '@/models/StudentCurriculum';
import { getEnrollmentByProfileId } from '@/services/enrollment';
import { createStudentCurriculum, getStudentCurriculumById, getStudentCurriculumByStudentId } from '@/services/studentCurriculum';
import { getStudentProfileById } from '@/services/studentProfile';
import { getSubjectByCategory } from '@/services/subject';
import { getStudentCurriculumsResponse } from '@/types';

/**
 * @StudentCurriculum
 */

// export const getStudentCurriculumByStudentIdAction = async (id: any): Promise<getStudentCurriculumsResponse> => {
//   try {
//     await dbConnect();
//     const p = await getStudentCurriculumByStudentId(id);
//     if (!p) {
//       return { error: 'not found', status: 404 };
//     }
//     return { curriculum: JSON.parse(JSON.stringify(p)), status: 201 };
//   } catch (error) {
//     return { error: 'Something went wrong', status: 500 };
//   }
// };
export const createStudentCurriculumAction = async (data: any) => {
  try {
    await dbConnect();
    const studentP = await getStudentProfileById(data.studentId);
    if (!studentP) {
      return { error: 'Invalid Student Id.', status: 500 };
    }
    const studentE = await getEnrollmentByProfileId(data.studentId);
    if (!studentE) {
      return { error: 'Invalid Student Id.', status: 500 };
    }
    // const curriculum = await getCurriculumByCourseId(studentE.courseId._id)
    // if (!curriculum) {
    //   return { error: 'Curriculum not found.', status: 500 };
    // }
    // console.log(curriculum)
    // @ts-ignore
    data.courseId = studentE.courseId._id;
    const studentCurriculum = await createStudentCurriculum(data);
    if (!studentCurriculum) {
      return { error: 'Something went wrong.', status: 500 };
    }
    return { curriculum: JSON.parse(JSON.stringify({})), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};

export const updateStudentCurriculumByIdAction = async (data: any) => {
  try {
    await dbConnect();
    console.log('data', data);
    const { CId, schoolYear, year, semester, order } = data;
    const checkC = await getStudentCurriculumById(CId);
    if (!checkC) return { error: 'Invalid id for Curriculom', status: 404 };
    if (checkC.curriculum && checkC.curriculum.length > 0) {
      const conflictExists = checkC.curriculum.some((entry: any) => entry.year === year && entry.semester === semester);
      if (conflictExists) {
        return { error: `Conflict: This year (${year}) and semester (${semester}) already exist.`, status: 409 };
      }

      // Check for conflicts in order
      const conflictOrderExists = checkC.curriculum.some((entry: any) => entry.order === order);
      if (conflictOrderExists) {
        return { error: `Conflict: Order ${order} is already occupied, choose another order number.`, status: 409 };
      }
    }

    const newCurriculumEntry = {
      schoolYear,
      order,
      year,
      semester,
    };

    const updatedCurriculum = await StudentCurriculum.findByIdAndUpdate(
      CId,
      {
        $push: { curriculum: newCurriculumEntry }, // Push the new entry to curriculum array
      },
      { new: true } // Return the updated document
    );
    if (!updatedCurriculum) return { error: `Curriculum not updated.`, status: 500 };
    return { meesage: 'Added New Curriculom Layer.', status: 201 };
  } catch (error) {
    console.log('server e: ', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const updateStudentCurriculumSubjectByIdAction = async (data: any) => {
  try {
    await dbConnect();
    const { CId, subjects } = data;
    //get all subjects
    const allS = await getSubjectByCategory('College');

    const validSubjectIds = allS.map((subject: any) => subject._id.toString());
    const invalidSubjects = subjects.filter((subjectId: string) => !validSubjectIds.includes(subjectId));
    if (invalidSubjects.length > 0) {
      return {
        error: `Invalid subject(s) found: ${invalidSubjects.join(', ')}`,
        status: 400, // Bad Request
      };
    }
    const newCurriculumEntry = subjects.map((subject: any, index: number) => ({
      order: index + 1, // You can customize the order logic as needed
      subjectId: subject, // Assuming 'subjects' is an array of subject IDs
    }));

    // Find the student curriculum
    const studentCurriculum = await StudentCurriculum.findOne({ 'curriculum._id': CId });

    if (!studentCurriculum) {
      return {
        error: 'Student curriculum not found.',
        status: 404, // Not Found
      };
    }

    // Extract existing subjects
    const curriculumEntry = studentCurriculum.curriculum.find((c: any) => c._id.toString() === CId);
    const existingSubjects = curriculumEntry ? curriculumEntry.subjectsFormat : [];

    const existingSubjectIds = existingSubjects.map((sf: any) => sf.subjectId.toString());
    // Determine which subjects need to be removed
    const subjectsToRemove = existingSubjects.filter((sf: any) => !subjects.includes(sf.subjectId.toString())).map((sf: any) => sf.subjectId.toString());

    // Determine which subjects need to be added
    const subjectsToAdd = subjects
      .filter((subjectId: string) => !existingSubjectIds.includes(subjectId))
      .map((subjectId: string, index: number) => ({
        order: existingSubjects.length + index + 1, // Assign new order
        subjectId: subjectId, // Use the subject ID directly
      }));

    // Perform the updates in separate operations to avoid conflicts
    // 1. Remove subjects not in the new list
    if (subjectsToRemove.length > 0) {
      await StudentCurriculum.updateOne({ 'curriculum._id': CId }, { $pull: { 'curriculum.$.subjectsFormat': { subjectId: { $in: subjectsToRemove } } } });
    }

    // 2. Add new subjects
    if (subjectsToAdd.length > 0) {
      await StudentCurriculum.updateOne({ 'curriculum._id': CId }, { $push: { 'curriculum.$.subjectsFormat': { $each: subjectsToAdd } } });
    }
    return { meesage: 'Added Subject to Curriculom Layer.', status: 201 };
  } catch (error) {
    console.log('server e: ', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
