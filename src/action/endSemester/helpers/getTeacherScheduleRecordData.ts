'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';

export const getTeacherScheduleRecordData = async (filteredSchedule: any, filterEnrolledEnrollments: any, eSetup: any) => {
  return tryCatch(async () => {
    let teacherSchededRecord = [];
    for (const sched of filteredSchedule) {
      if (sched.blockTypeId || sched.blockTypeId !== undefined || sched.blockTypeId !== null) {
        const processedScheduleRecord = {
          category: sched.category,
          schoolYear: eSetup.schoolYear,
          profileId: sched.profileId,
          course: { ...sched.courseId },
          blockType: { ...sched.blockTypeId },
          subject: { ...sched.subjectId },
          days: sched.days,
          startTime: sched.startTime,
          room: { roomName: sched.roomId.roomName },
          endTime: sched.endTime,
          studentsInClass: <any>[],
        };
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
        teacherSchededRecord.push(processedScheduleRecord);
      }
    }
    if (teacherSchededRecord.length === 0) return { error: 'No datas find of ts Records', status: 404 };
    return { success: true, data: teacherSchededRecord, status: 200 };
  });
};
