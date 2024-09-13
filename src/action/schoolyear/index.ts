'use server';
import dbConnect from '@/lib/db/db';
import { createSchoolYear, getAllSchoolYear, getSchoolYearByYear, updateManySchoolYear } from '@/services/schoolYear';
import { getAllSchoolYearResponse } from '@/types';

export const createSchoolYearAction = async (data: any) => {
  try {
    await dbConnect();
    const checkSchoolYearConflict = await getSchoolYearByYear(data.schoolYear);
    if (checkSchoolYearConflict) return { error: 'Room name already exists.', status: 403 };
    if (data.isEnable === true) {
      const updatedEnableFalse = await updateManySchoolYear();
      console.log('updatedEnableFalse',updatedEnableFalse)
    }
    const createdSchoolYear = await createSchoolYear(data);
    if (!createdSchoolYear) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Subject created successfully.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getAllSchoolYearAction = async (): Promise<getAllSchoolYearResponse> => {
  try {
    await dbConnect();
    const sy = await getAllSchoolYear();
    return { sy: JSON.parse(JSON.stringify(sy)), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};
