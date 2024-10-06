'use server';
import dbConnect from '@/lib/db/db';
import { getEnrollmentByProfileId } from '@/services/enrollment';
import { getTeacherReportGradeById, updateTeacherReportGradeStatusById } from '@/services/reportGrade';

export const evaluateApprovedGradeReportAction = async (data: any) => {
  try {
    await dbConnect();
    const reportedGrades = await getTeacherReportGradeById(data.reportGradeId);
    if (!reportedGrades) return { error: 'Something went wrong.', status: 403 };
    for (const rg of reportedGrades.reportedGrade) {
      const se = await getEnrollmentByProfileId(rg.profileId._id);
      // @ts-ignore
      if (se && se.studentSubjects.length > 0) {
        // @ts-ignore
        const filteredSubjects = se.studentSubjects.filter((subject) => {
          return subject.status === 'Approved' && subject.teacherScheduleId._id.toString() === reportedGrades.teacherScheduleId._id.toString();
        });
        for (const subject of filteredSubjects) {
          subject.grade = rg.grade;

          await se.save();
        }
      }
    }
    // update the rg to already evaluated
    await updateTeacherReportGradeStatusById(reportedGrades.id, { evaluated: true });
    //   const reportedGrades = await updateTeacherReportGradeStatusById(data.reportGradeId, data);
    //   if (!reportedGrades) return { error: 'Something went wrong.', status: 500 };
    return { message: ` Grades has been Evaluated to students.`, status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
