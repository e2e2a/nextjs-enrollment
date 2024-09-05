'use server';
import dbConnect from '@/lib/db/db';
import { createSubjectCollege, getSubjectCategoryCollege } from '@/services/subject';
import { getSubjectCategoryCollegeResponse } from '@/types';

// export const getEnrollmentByStepAction = async (userId: any): Promise<getEnrollmentResponse> => {
export const createSubjectCollegeAction = async (data: any) => {
  try {
    await dbConnect();
    const createdSubject = await createSubjectCollege(data);
    if (!createdSubject) return { error: 'Something went wrong.', status: 500 };
    console.log('data in ser:', data);
    return { message: 'Subject created successfully.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getSubjectCategoryCollegeAction = async (): Promise<getSubjectCategoryCollegeResponse> => {
  try {
    await dbConnect();
    const subjects = await getSubjectCategoryCollege();
    console.log('data in ser:', subjects);
    // if (!subjects) return { error: 'Something went wrong.', status: 500 };
    // console.log('data in ser:', category);
    return { subjects: JSON.parse(JSON.stringify(subjects)), status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
