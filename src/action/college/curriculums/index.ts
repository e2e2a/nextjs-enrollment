'use server';
import dbConnect from '@/lib/db/db';
import Curriculum from '@/models/Curriculum';
import StudentCurriculum from '@/models/StudentCurriculum';
import { getAllCurriculum, getCurriculumByCourseId, getCurriculumById, updateCurriculumById } from '@/services/curriculum';
import { getEnrollmentByProfileId } from '@/services/enrollment';
import { createStudentCurriculum, getAllStudentCurriculum, getStudentCurriculumById, getStudentCurriculumByStudentId } from '@/services/studentCurriculum';
import { getStudentProfileById } from '@/services/studentProfile';
import { getSubjectCategoryCollege } from '@/services/subject';
import { getAllCurriculumsResponse, getAllStudentCurriculumsResponse, getCurriculumsResponse } from '@/types';

export const getAllCurriculumAction = async (): Promise<getAllCurriculumsResponse> => {
  try {
    await dbConnect();
    const p = await getAllCurriculum();
    return { curriculums: JSON.parse(JSON.stringify(p)), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getCurriculumByIdAction = async (id: any): Promise<getCurriculumsResponse> => {
  try {
    await dbConnect();
    const p = await getCurriculumById(id);
    return { curriculum: JSON.parse(JSON.stringify(p)), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};
export const getCurriculumByCourseIdAction = async (courseId: any): Promise<getCurriculumsResponse> => {
  try {
    await dbConnect();
    const p = await getCurriculumByCourseId(courseId);
    return { curriculum: JSON.parse(JSON.stringify(p)), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};

export const updateCurriculumByIdAction = async (data: any) => {
  try {
    await dbConnect();
    const { CId, year, semester, order } = data;
    const checkC = await getCurriculumById(CId);
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
      order,
      year,
      semester,
    };

    const updatedCurriculum = await Curriculum.findByIdAndUpdate(
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

export const updateCurriculumSubjectByIdAction = async (data: any) => {
  try {
    console.log('data in e:', data);
    await dbConnect();
    const { CId, subjects } = data;
    //get all subjects
    const allS = await getSubjectCategoryCollege();

    // Check if each subject exists in the list of all subjects
    const validSubjectIds = allS.map((subject: any) => subject._id.toString());

    // Find the missing or invalid subjects by checking if each received subject ID exists in the validSubjectIds array
    const invalidSubjects = subjects.filter((subjectId: string) => !validSubjectIds.includes(subjectId));

    // If there are invalid subjects, return an error
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

    await Curriculum.updateOne(
      { 'curriculum._id': CId },
      { $set: { 'curriculum.$.subjectsFormat': [] } } // Clear existing entries
    );

    // Add new entries to the subjectsFormat array
    const updatedCurriculumSubject = await Curriculum.updateOne(
      { 'curriculum._id': CId },
      { $push: { 'curriculum.$.subjectsFormat': { $each: newCurriculumEntry } } }, // Push new entries
      { new: true } // Return the updated document
    );
    return { meesage: 'Added Subject to Curriculom Layer.', status: 201 };
  } catch (error) {
    console.log('server e: ', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

/**
 * @StudentCurriculum
 */
export const getAllStudentCurriculumAction = async (): Promise<getAllStudentCurriculumsResponse> => {
  try {
    await dbConnect();
    const p = await getAllStudentCurriculum();
    return { curriculums: JSON.parse(JSON.stringify(p)), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getStudentCurriculumByStudentIdAction = async (id: any): Promise<getCurriculumsResponse> => {
  try {
    await dbConnect();
    const p = await getStudentCurriculumByStudentId(id);
    if (!p) {
      return { error: 'not found', status: 404 };
    }
    return { curriculum: JSON.parse(JSON.stringify(p)), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};
export const createStudentCurriculumAction = async (data: any) => {
  try {
    await dbConnect();
    console.log(data)
    const studentP = await getStudentProfileById(data.studentId)
    if (!studentP) {
      return { error: 'Invalid Student Id.', status: 500 };
    }
    const studentE = await getEnrollmentByProfileId(data.studentId)
    if (!studentE) {
      return { error: 'Invalid Student Id.', status: 500 };
    }
    // const curriculum = await getCurriculumByCourseId(studentE.courseId._id)
    // if (!curriculum) {
    //   return { error: 'Curriculum not found.', status: 500 };
    // }
    // console.log(curriculum)
    data.courseId = studentE.courseId._id
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
    console.log('data', data)
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
    console.log('data in e:', data);
    await dbConnect();
    const { CId, subjects } = data;
    //get all subjects
    const allS = await getSubjectCategoryCollege();

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
console.log('existingSubjectIds: ', existingSubjectIds);
    // Determine which subjects need to be removed
    const subjectsToRemove = existingSubjects
      .filter((sf: any) => !subjects.includes(sf.subjectId.toString()))
      .map((sf: any) => sf.subjectId.toString());

    // Determine which subjects need to be added
    const subjectsToAdd = subjects
      .filter((subjectId: string) => !existingSubjectIds.includes(subjectId))
      .map((subjectId: string, index: number) => ({
        order: existingSubjects.length + index + 1, // Assign new order
        subjectId: subjectId, // Use the subject ID directly
      }));
      console.log('subjects to add', subjectsToAdd)

    // Perform the updates in separate operations to avoid conflicts
    // 1. Remove subjects not in the new list
    if (subjectsToRemove.length > 0) {
      await StudentCurriculum.updateOne(
        { 'curriculum._id': CId },
        { $pull: { 'curriculum.$.subjectsFormat': { subjectId: { $in: subjectsToRemove } } } }
      );
    }

    // 2. Add new subjects
    if (subjectsToAdd.length > 0) {
      await StudentCurriculum.updateOne(
        { 'curriculum._id': CId },
        { $push: { 'curriculum.$.subjectsFormat': { $each: subjectsToAdd } } }
      );
    }
    return { meesage: 'Added Subject to Curriculom Layer.', status: 201 };
  } catch (error) {
    console.log('server e: ', error);
    return { error: 'Something went wrong', status: 500 };
  }
};