'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { DownPaymentValidator } from '@/lib/validators/downPayment/create';
import { getCourseByCourseCode } from '@/services/course';
import { createDownPayment, getDownPaymentByCourseId } from '@/services/downPayment';
import { checkAuth } from '@/utils/actions/session';

export const createDownPaymentAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    if (session.user.role !== 'ACCOUNTING') return { error: 'Forbidden', status: 403 };

    // i commented the code because its only have 1 field to save
    // const courseParse = DownPaymentValidator.safeParse(data);
    // if (!courseParse.success) return { error: 'Invalid fields!', status: 400 };

    const course = await getCourseByCourseCode(data.courseCode);
    if (!course) return { error: 'Course Not Found.', status: 404 };

    const checkDp = await getDownPaymentByCourseId(course._id);
    if (checkDp) return { error: `Course already have a down payment default.`, status: 409 };

    const createdDP = await createDownPayment({ courseId: course._id, category: course.category, defaultPayment: data.defaultPayment });
    if (!createdDP) return { error: 'Error creating', status: 500 };

    return { success: true, message: `Default Down Payment for the course ${data.courseCode.toUpperCase()} has been created.`, category: course.category, status: 201 };
  });
};
