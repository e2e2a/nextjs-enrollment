'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentByUserId } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';

export const getEnrollmentBySessionIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    // Not authenticated || Not Foribidden
    if (!session || session.error || session.user.role !== 'STUDENT' || id !== session.user._id) return { error: 'Foribidden.', status: 403 };

    const enrollment = await getEnrollmentByUserId(session.user._id);

    return { enrollment: JSON.parse(JSON.stringify(enrollment)), status: 200 };
  });
};
