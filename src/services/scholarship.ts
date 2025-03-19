'use server';
import Scholarship from '@/models/Scholarship';

export const createScholarship = async (data: any) => {
  try {
    const newS = new Scholarship({ ...data });
    // const s = await newS.save();
    return newS;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getScholarshipByProfileId = async (profileId: string) => {
  try {
    const s = await Scholarship.findOne({ profileId }).populate('profileId');
    return s;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getScholarshipById = async (id: string) => {
  try {
    const s = await Scholarship.findById(id).populate('profileId');
    return s;
  } catch (error) {
    return null;
  }
};

export const getScholarshipByCategory = async (category: string) => {
  try {
    const s = await Scholarship.find({ category }).populate('profileId');
    return s;
  } catch (error) {
    return [];
  }
};
