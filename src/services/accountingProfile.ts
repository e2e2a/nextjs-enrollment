'use server';
import AccountingProfile from '@/models/AccountingProfile';

export const createAccountingProfile = async (data: any) => {
  try {
    const newProfile = await AccountingProfile.create({ ...data });
    return newProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAccountingProfileByUserId = async (userId: any) => {
  try {
    const AProfile = await AccountingProfile.findOne({ userId })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .exec();
    return AProfile;
  } catch (error) {
    return null;
  }
};

export const getAllAccountingProfile = async () => {
  try {
    const AccProfile = await AccountingProfile.find()
      .populate({
        path: 'userId',
        select: '-password',
      })
      .exec();
    return AccProfile;
  } catch (error) {
    return null;
  }
};

export const updateAccountingProfileByUserId = async (userId: string, data: any) => {
  try {
    const updatedProfile = await AccountingProfile.findOneAndUpdate({ userId }, { ...data }, { new: true });
    return updatedProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};
