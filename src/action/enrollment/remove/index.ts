'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Enrollment from '@/models/Enrollment';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getEnrollmentByProfileId } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';

export const removeStudentScheduleAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const enrollment = await getEnrollmentByProfileId(data.profileId);
    if (!enrollment) return { error: 'Enrollment ID is not valid.', status: 404 };

    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) return { error: `Instructor Schedule ID is not valid.`, status: 404 };

    const studentSubject = enrollment.studentSubjects.find((subject: any) => subject.teacherScheduleId._id.toString() === data.teacherScheduleId);
    if (!studentSubject) return { error: 'Instructor Schedule not found in student subjects.', status: 404 };

    if (studentSubject.firstGrade || studentSubject.secondGrade || studentSubject.thirdGrade || studentSubject.fourthGrade || studentSubject.averageTotal) return { error: 'Cannot remove schedule. Grade has already been recorded.', status: 409 };

    await Enrollment.findByIdAndUpdate(enrollment._id, { $pull: { studentSubjects: { teacherScheduleId: teacherSchedule._id, profileId: enrollment.profileId._id } } }, { new: true });
    return { message: 'Schedule has been removed.', id: enrollment._id.toString(), status: 200 };
  });
};
