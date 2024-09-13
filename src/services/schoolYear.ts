'use server';
import SchoolYear from '@/models/SchoolYear';

export const createSchoolYear = async (data: any) => {
  try {
    const newS = new SchoolYear({
      ...data,
    });
    const sy = await newS.save();
    return sy;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllSchoolYear = async () => {
  try {
    const sy = await SchoolYear.find();
    return sy;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getSchoolYearByYear = async (schoolYear: any) => {
  try {
    const sy = await SchoolYear.findOne({schoolYear});
    return sy;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getSchoolYearById = async (id: any) => {
  try {
    const sy = await SchoolYear.findById(id);
    return sy;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Update all documents where isEnable is false
export const updateManySchoolYear = async () => {
  try {
    const result = await SchoolYear.updateMany({ isEnable: true }, { $set: { isEnable: false } });
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error updating documents:', error);
    return null;
  }
};
