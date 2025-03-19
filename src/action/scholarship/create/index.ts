'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { ScholarshipValidator } from '@/lib/validators/scholarship';
import { getAccountingProfileByUserId } from '@/services/accountingProfile';
import { createScholarship, getScholarshipByProfileId } from '@/services/scholarship';
import { getStudentProfileById, updateStudentProfileById } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

/**
 * handles create Scholarship by category
 *
 * @param {Object} data
 */
export const createScholarshipAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    if (session.user?.role !== 'ACCOUNTING') return { error: 'Forbidden.', status: 403 };

    const p = await getAccountingProfileByUserId(session?.user?._id);
    if (!p) return { error: 'User Data was not found.', status: 404 };

    const parse = ScholarshipValidator.safeParse(data);
    if (!parse.success) return { error: 'Invalid fields!', status: 400 };

    const isValidObjectId = mongoose.Types.ObjectId.isValid(data.studentId);
    if (!isValidObjectId) return { error: `Student ID ${data.studentId} is not valid.`, status: 404 };
    const sConflict = await getScholarshipByProfileId(data.studentId);
    if (sConflict) return { error: 'Student already has a scholarship. Please edit it in Scholarship Management.', status: 409 };
    const studentProfile = await getStudentProfileById(data.studentId);
    if (!studentProfile) return { error: 'Student Profile Not Found.', status: 404 };
    const createdScholarship = await createScholarship({ ...parse.data, profileId: studentProfile._id, userId: studentProfile.userId._id });
    if (!createdScholarship) return { error: 'Something went wrong.', status: 500 };

    const student = await updateStudentProfileById(data.studentId, { scholarshipId: createdScholarship._id });
    if (!student) return { error: 'Something went wrong.', status: 500 };

    await createdScholarship.save();
    return { message: 'Scholarship created successfully.', category: data.category, status: 201 };
  });
};
