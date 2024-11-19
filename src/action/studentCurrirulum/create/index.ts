'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import StudentCurriculum from '@/models/StudentCurriculum';
import { createStudentCurriculum } from '@/services/studentCurriculum';
import { getStudentProfileById } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';

export const createStudentCurriculumAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN' && session.user.role !== 'DEAN') return { error: 'Forbidden.', status: 403 };

    const a = await checkCategory(data);
    return a;
  });
};

const checkCategory = async (data: any) => {
  return tryCatch(async () => {
    switch (data.category) {
      case 'College':
        return await handleCollege(data);
      case '2':
        return { success: true, status: 200 };
      default:
        return { error: 'Invalid category.', status: 400 };
    }
  });
};

const handleCollege = async (data: any) => {
  return tryCatch(async () => {
    const studentP = await getStudentProfileById(data.studentId);
    if (!studentP) return { error: 'Invalid Student Id.', status: 500 };
    if (!studentP.courseId || studentP.courseId === null || studentP.courseId === undefined) return { error: "Student doesn't have any enrolled course.", status: 404 };

    const a = await StudentCurriculum.find({ studentId: studentP._id }).populate('courseId');
    const b = a.filter((a) => a.courseId._id.toString() === studentP.courseId._id.toString());
    if (b && b.length > 0) return { error: 'Student has already a Curriculum with this course.', status: 409 };

    const c = await createStudentCurriculum({ category: data.category, studentId: data.studentId, courseId: studentP.courseId._id });
    studentP.studentCurriculumId = c._id;
    const d = await studentP.save();
    return { success: true, message: 'New Student Curriculum has been added.', id: c._id.toString(), status: 201 };
  });
};
