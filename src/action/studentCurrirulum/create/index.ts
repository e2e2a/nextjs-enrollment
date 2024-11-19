'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import StudentCurriculum from '@/models/StudentCurriculum';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { createStudentCurriculum } from '@/services/studentCurriculum';
import { getStudentProfileById } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';

export const createStudentCurriculumAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN' && session.user.role !== 'DEAN') return { error: 'Forbidden.', status: 403 };

    const a = await checkCategory(session.user, data);
    return a;
  });
};

const checkCategory = async (user: any, data: any) => {
  return tryCatch(async () => {
    switch (data.category) {
      case 'College':
        return await handleCollege(user, data);
      case '2':
        return { success: true, status: 200 };
      default:
        return { error: 'Invalid category.', status: 400 };
    }
  });
};

const handleCollege = async (user: any, data: any) => {
  return tryCatch(async () => {
    const studentP = await getStudentProfileById(data.studentId);
    if (!studentP) return { error: 'Invalid Student Id.', status: 500 };
    if (!studentP.courseId || studentP.courseId === null || studentP.courseId === undefined) return { error: "Student doesn't have any enrolled course.", status: 404 };

    const a = await StudentCurriculum.find({ studentId: studentP._id }).populate('courseId');
    const b = a.filter((a) => a.courseId._id.toString() === studentP.courseId._id.toString());
    if (b && b.length > 0) return { error: 'Student has already a Curriculum with this course.', status: 409 };
    if (user.role === 'DEAN') {
      const d = await getDeanProfileByUserId(user._id);
      if (d.courseId._id.toString() !== studentP.courseId._id.toString()) return { error: 'Forbidden', status: 403 };
    }
    const c = await createStudentCurriculum({ category: data.category, studentId: data.studentId, courseId: studentP.courseId._id });
    studentP.studentCurriculumId = c._id;
    const d = await studentP.save();
    return { success: true, message: 'New Student Curriculum has been added.', id: c._id.toString(), status: 201 };
  });
};
