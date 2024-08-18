"use server"
import dbConnect from "@/lib/db/db";
import { getEnrollmentByStep } from "@/services/enrollment";
import { getEnrollmentResponse } from "@/types";

export const getEnrollmentByStepAction = async (userId: any): Promise<getEnrollmentResponse> => {
    try {
      await dbConnect()
      const enrollments = await getEnrollmentByStep(userId);
      return {enrollment: enrollments, status: 200};
    } catch (error) {
      console.log('server e :', error);
      return { error: 'Something went wrong', status: 500 };
    }
  };