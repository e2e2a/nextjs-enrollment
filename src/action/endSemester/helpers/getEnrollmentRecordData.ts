'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { IEnrollmentRecord } from '@/models/EnrollmentRecord';
import StudentCurriculum from '@/models/StudentCurriculum';
import { createStudentCurriculum } from '@/services/studentCurriculum';

export const getEnrollmentRecordData = async (filterEnrolledEnrollments: any) => {
  return tryCatch(async () => {
    let enrollmentRecords = [];
    for (const enrollment of filterEnrolledEnrollments) {
      const { _id, ...rest } = enrollment;
      const processedRecord = {
        ...rest,
        category: 'College',
        profileId: enrollment.profileId._id,
        course: enrollment.courseId.name,
        courseCode: enrollment.courseId.courseCode,
        blockType: { ...enrollment.blockTypeId },
        studentType: enrollment.profileId.studentType,
        createdAt: new Date(),
        studentSubjects: <any>[],
        // Add any additional fields required by your EnrollmentRecord model
      };
      let studentSubjects: IEnrollmentRecord[] = [];
      for (const ss of enrollment.studentSubjects) {
        const processedSubjectRecord = {
          ...ss,
          subject: { ...ss.teacherScheduleId?.subjectId },
          ...(ss.teacherScheduleId?.profileId && { teacher: { ...ss.teacherScheduleId.profileId } }),
          ...(ss.teacherScheduleId?.deanId && { teacher: { ...ss.teacherScheduleId.deanId } }),
          blockType: { ...ss.teacherScheduleId.blockTypeId },
          days: ss.teacherScheduleId.days,
          startTime: ss.teacherScheduleId.startTime,
          endTime: ss.teacherScheduleId.endTime,
          room: { roomName: ss.teacherScheduleId.roomId.roomName },
          profileId: ss.profileId?._id,
        };

        studentSubjects.push(processedSubjectRecord);
      }
      processedRecord.studentSubjects = studentSubjects;

      // for student curriculum
      const a = await updateStudentCurriculum(enrollment, studentSubjects);

      enrollmentRecords.push(processedRecord);
    }
    if (enrollmentRecords.length === 0) return { error: 'No datas find of ts Records', status: 404 };
    return { success: true, data: enrollmentRecords, status: 200 };
  });
};

const updateStudentCurriculum = async (enrollment: any, studentSubjects: any) => {
  return tryCatch(async () => {
    let studentCurriculum;
    studentCurriculum = await StudentCurriculum.findOne({ studentId: enrollment.profileId._id, courseId: enrollment.courseId._id }).populate({
      path: 'curriculum.subjectsFormat',
      populate: [{ path: 'subjectId' }],
    });
    if (!studentCurriculum) studentCurriculum = await createStudentCurriculum({ category: 'College', studentId: enrollment.profileId._id, courseId: enrollment.courseId._id });
    const curriculumExists = studentCurriculum.curriculum.some((c: any) => c.year === enrollment.studentYear && c.semester === enrollment.studentSemester && enrollment.schoolYear === c.schoolYear);

    if (curriculumExists) {
      for (const curriculum of studentCurriculum.curriculum) {
        let updateSubjects = <any>[];

        if (curriculum.year === enrollment.studentYear && curriculum.semester === enrollment.studentSemester) {
          for (const studentS of studentSubjects) {
            if (studentS.status === 'Approved') {
              let subjectFound = false;

              for (const subject of curriculum.subjectsFormat) {
                // console.log('1', subject.subjectId);
                if (studentS.subject.subjectCode === subject.subjectId.subjectCode) {
                  // console.log('2', subject.subjectId);
                  const a = await getAverageGrade(studentS, true);
                  subject.grade = a.grade;
                  subjectFound = true;
                }
              }
              if (!subjectFound) await getAverageGrade(studentS, false, updateSubjects);
            }
          }

          if (updateSubjects.length > 0) await StudentCurriculum.updateOne({ 'curriculum._id': curriculum._id }, { $push: { 'curriculum.$.subjectsFormat': { $each: updateSubjects } } });
        }
      }
    } else {
      let updateSubjects = <any>[];
      for (const studentS of studentSubjects) {
        if (studentS.status === 'Approved') await getAverageGrade(studentS, false, updateSubjects);
      }

      const { schoolYear, studentYear, studentSemester } = enrollment;
      const newC = { schoolYear: schoolYear, year: studentYear, semester: studentSemester, subjectsFormat: updateSubjects };

      await studentCurriculum.curriculum.push(newC);
    }
    await studentCurriculum.save();
  });
};

const getAverageGrade = async (studentS: any, found: boolean, updateSubjects?: any) => {
  return tryCatch(async () => {
    const grades = [Number(studentS.firstGrade), Number(studentS.secondGrade), Number(studentS.thirdGrade), Number(studentS.fourthGrade)];
    if (grades.some(isNaN)) {
      if (found) return { grade: 'INC' };
      updateSubjects.push({ subjectId: studentS.subject._id, grade: 'INC' });
    } else {
      const b = grades.filter((e) => !e);
      if (found && b.length > 0) return { grade: 'INC' };
      const validGrades = grades.filter((grade) => !isNaN(grade));
      const averageGrade = parseFloat((validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length).toFixed(2));
      if (found) return { grade: averageGrade };
      updateSubjects.push({ subjectId: studentS.subject._id.toString(), grade: b.length > 0 ? 'INC' : averageGrade });
    }
  });
};
