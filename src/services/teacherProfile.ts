"use server"
import TeacherProfile from "@/models/TeacherProfile";

export const createTeacherProfile = async (data: any) => {
    try {
      const newProfile = await TeacherProfile.create({
        ...data,
      });
      return newProfile;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  export const getAllTeacherProfile = async () => {
    try {
      const TProfile = await TeacherProfile.find().populate('userId').exec();
      return TProfile;
    } catch (error) {
      return null;
    }
  };
  