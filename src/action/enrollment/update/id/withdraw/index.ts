'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentById, updateEnrollmentById } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';

export const updateEnrollmentWithdrawAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authenticated', status: 403 };

    const a = await checkRole(session.user, data);

    return a;
  });
};

const checkRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    const enrollment = await getEnrollmentById(data.id);
    if (!enrollment) return { error: 'Enrollment not found.', status: 404 };

    let a;
    switch (user.role) {
      case 'STUDENT':
        a = await handleStudent(data, enrollment);
        break;
      case 'ADMIN':
        a = await handleAdmin(data, enrollment);
        break;
      case 'DEAN':
        a = await handleDean(data, enrollment);
        break;
      default:
        return { error: 'Invalid Role', status: 403 };
    }

    return { ...a, courseId: enrollment?.courseId?._id, category: 'College' };
  });
};

const handleStudent = async (data: any, enrollment: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authenticated', status: 403 };

    if (!data.request && (enrollment.withdrawApprovedByDean || enrollment.withdrawApprovedByAdmin)) return { error: 'Cancelling withdraw is only applicable if both status is pending.', status: 400 };

    const updated = await updateEnrollmentById(data.id, { id: data.id, requestWithdraw: data.request, withdrawReason: data.reason });
    if (!updated) return { error: 'Something went wrong.', status: 500 };

    return { message: 'Succesfully requesting withdraw.', id: enrollment?.userId?._id.toString(), status: 201 };
  });
};

const handleAdmin = async (data: any, enrollment: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authenticated', status: 403 };

    const updated = await updateEnrollmentById(data.id, { id: data.id, withdrawApprovedByAdmin: data.request, ...(enrollment.withdrawApprovedByDean ? { enrollStatus: 'Withdraw' } : {}) });
    if (!updated) return { error: 'Something went wrong.', status: 500 };

    return { message: 'Succesfully requesting withdraw.', id: enrollment?.userId?._id.toString(), status: 201 };
  });
};

const handleDean = async (data: any, enrollment: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authenticated', status: 403 };

    const updated = await updateEnrollmentById(data.id, { id: data.id, withdrawApprovedByDean: data.request, ...(enrollment.withdrawApprovedByAdmin ? { enrollStatus: 'Withdraw' } : {}) });
    if (!updated) return { error: 'Something went wrong.', status: 500 };

    return { message: 'Succesfully requesting withdraw.', id: enrollment?.userId?._id.toString(), status: 201 };
  });
};
