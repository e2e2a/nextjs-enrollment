'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getReportGradeByCategory } from '@/services/reportGrade';

export const getTeacherScheduleRecordData = async (filteredSchedule: any, filterEnrolledEnrollments: any, eSetup: any) => {
  return tryCatch(async () => {
    let teacherSchededRecord = [];
    let ReportedGradesRecord = [];
    const reportedGrades = await getReportGradeByCategory('College');
    for (const sched of filteredSchedule) {
      let filteredReportGrades = [];
      const isValidBlockType = sched.blockTypeId || sched.blockTypeId !== undefined || sched.blockTypeId !== null;
      if (isValidBlockType && sched.courseId) {
        filteredReportGrades = reportedGrades.filter((rg) => rg.teacherScheduleId._id.toString() === sched._id.toString());
        const processedScheduleRecord = {
          category: sched.category,
          schoolYear: eSetup.schoolYear,
          ...(sched.profileId && { profileId: sched.profileId }),
          ...(sched.deanId && { deanId: sched.deanId }),
          course: { ...sched.courseId },
          blockType: { ...sched.blockTypeId },
          subject: { ...sched.subjectId },
          days: sched.days,
          startTime: sched.startTime,
          room: { roomName: sched.roomId.roomName },
          endTime: sched.endTime,
          studentsInClass: <any>[],
        };
        for (const rg of filteredReportGrades) {
          const processRG = {
            category: rg.category,
            schoolYear: eSetup.schoolYear,
            ...(sched?.profileId && { teacherId: sched.profileId }),
            ...(sched?.deanId && { teacherId: sched.deanId }),
            course: { ...sched.courseId },
            blockType: { ...sched.blockTypeId },
            subject: { ...sched.subjectId },
            days: sched.days,
            startTime: sched.startTime,
            room: { roomName: sched.roomId.roomName },
            endTime: sched.endTime,
            type: rg.type,
            reportedGrade: <any>[],
            statusInDean: rg.statusInDean,
            evaluated: rg.evaluated,
            isTrash: rg.isTrash,
          };
          for (const studentsInRG of rg.reportedGrade) {
            const processedStudentInReportedGrades = {
              profileId: { ...studentsInRG.profileId },
              grade: studentsInRG.grade,
            };
            processRG.reportedGrade.push(processedStudentInReportedGrades);
          }
          ReportedGradesRecord.push(processRG);
        }
        for (const studentEnrollment of filterEnrolledEnrollments) {
          for (const studentSubject of studentEnrollment.studentSubjects) {
            if (studentSubject.teacherScheduleId._id.toString() === sched._id.toString()) {
              if (studentSubject.status === 'Approved') {
                const processedStudentInClassRecord = {
                  student: { ...studentSubject.profileId },
                  ...studentSubject, // this data have the 5 fields of the grades
                };
                processedScheduleRecord.studentsInClass.push(processedStudentInClassRecord);
              }
            }
          }
        }
        if (processedScheduleRecord.studentsInClass > 0) teacherSchededRecord.push(processedScheduleRecord); // ignore if there is no students in teacher schedule
      }
    }
    if (teacherSchededRecord.length === 0) return { error: 'No datas find of ts Records', status: 404 };
    return { success: true, data: teacherSchededRecord, rg: ReportedGradesRecord, status: 200 };
  });
};
