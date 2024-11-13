'use server';
import dbConnect from '@/lib/db/db';
import { getReportGradeById, updateTeacherReportGradeStatusById } from '@/services/reportGrade';

// export const createTeacherReportGradeAction = async (data: any) => {
//   try {
//     await dbConnect();
//     const ESetup = await getEnrollmentSetupByName('GODOY')
//     data.statusInDean = 'Pending';
//     data.evaluated = false;
//     data.schoolYear = ESetup.enrollmentTertiary.schoolYear;
//     const createdReportGrade = await createTeacherReportGrade(data);
//     if (!createdReportGrade) return { error: 'Something went wrong.', status: 500 };
//     return { message: 'Grade has been Report.', status: 201 };
//   } catch (error) {
//     console.log('server e :', error);
//     return { error: 'Something went wrong', status: 500 };
//   }
// };

// export const getAllTeacherReportGradeAction = async () => {
//   try {
//     await dbConnect();
//     const reportedGrades = await getAllTeacherReportGrade();
//     return { reportedGrades: JSON.parse(JSON.stringify(reportedGrades)), status: 201 };
//   } catch (error) {
//     console.log('server e :', error);
//     return { error: 'Something went wrong', status: 500 };
//   }
// };

export const getTeacherReportGradeByIdAction = async (id: any) => {
  try {
    await dbConnect();
    const reportedGrades = await getReportGradeById(id);
    return { reportedGrades: JSON.parse(JSON.stringify(reportedGrades)), status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const updateTeacherReportGradeStatusByIdAction = async (data: any) => {
  try {
    await dbConnect();
    const reportedGrades = await updateTeacherReportGradeStatusById(data.reportGradeId, data);
    if (!reportedGrades) return { error: 'Something went wrong.', status: 500 };
    return { message: `Report has been ${data.statusInDean}.`, status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
