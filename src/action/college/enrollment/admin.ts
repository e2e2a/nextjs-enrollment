'use server';
import dbConnect from '@/lib/db/db';
import { getAllEnrollment, getAllEnrollmentByTeacherScheduleId, getEnrollmentById, updateEnrollmentById } from '@/services/enrollment';
import { getEnrollmentResponse, getSingleEnrollmentResponse } from '@/types';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { createPDF } from '../../createPdf';
import { getBlockTypeById } from '@/services/blockType';
import { getSchoolYearByYear } from '@/services/schoolYear';
import StudentProfile from '@/models/StudentProfile';
import { getAllStudentProfile, updateStudentProfileById } from '@/services/studentProfile';
import EnrollmentRecord from '@/models/EnrollmentRecord';
import { getAllTeacherSchedule } from '@/services/teacherSchedule';
import TeacherScheduleRecord from '@/models/TeacherScheduleRecord';
import { getEnrollmentSetupByName, updateEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import StudentCurriculum from '@/models/StudentCurriculum';
import { createStudentCurriculum } from '@/services/studentCurriculum';
import ReportGrade from '@/models/ReportGrade';
import { setProgress } from './helpers/progress';
import Enrollment from '@/models/Enrollment';
import TeacherSchedule from '@/models/TeacherSchedule';
import Course from '@/models/Course';
import BlockType from '@/models/BlockType';
// import { verificationTemplate } from './emailTemplate/verificationTemplate';
export const getAllEnrollmentAction = async (category: string): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const enrollments = await getAllEnrollment(category);

    return { enrollment: JSON.parse(JSON.stringify(enrollments)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
// export const getEnrollmentByStepAction = async (userId: any): Promise<getEnrollmentResponse> => {
//   try {
//     await dbConnect();
//     const enrollments = await getEnrollmentByStep(userId);
//     return { enrollment: JSON.parse(JSON.stringify(enrollments)), status: 200 };
//   } catch (error) {
//     console.log('server e :', error);
//     return { error: 'Something went wrong', status: 500 };
//   }
// };

// export const approvedEnrollmentStep1Action = async (data: any) => {
//   try {
//     await dbConnect();
//     const checkE = await getEnrollmentById(data.EId);
//     if (!checkE) return { error: 'Id is not valid', status: 403 };
//     if (data.studentType === 'regular') {
//       const checkBlock = await getBlockTypeById(data.blockType);
//       if (!checkBlock) return { error: 'Block Type is not valid', status: 403 };
//     }
//     data.step = 2;
//     if(data.blockType === ''){
//       data.blockType = null
//     }

//     // const checkSY = await getSchoolYearByYear(data.schoolYear);
//     // if (!checkSY) return { error: 'SchoolYear is not valid', status: 403 };

//     // @ts-ignore
//     const updateP = await StudentProfile.findByIdAndUpdate(checkE.profileId._id, { studentType: data.studentType })
//     if(!updateP){
//       return { error: 'There must be a problem in updating student profile.', status: 500 };
//     }
//     await updateEnrollmentById(data.EId, { step: 2, blockTypeId: data.blockType, schoolYear: data.schoolYear });
//     // const pdf = await sendEmailWithPDF(checkE);
//     return { message: 'Student has been completed step 1.', status: 201 };
//   } catch (error) {
//     console.log('server e :', error);
//     return { error: 'Something went wrong', status: 500 };
//   }
// };

// export const approvedEnrollmentStep2Action = async (data: any) => {
//   try {
//     await dbConnect();
//     const checkE = await getEnrollmentById(data.EId);
//     if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
//     await updateEnrollmentById(data.EId, { step: 3 });
//     // await sendEmailWithPDF(checkE);
//     return { message: 'Student has been completed step 2.', status: 201 };
//   } catch (error) {
//     console.log('server e :', error);
//     return { error: 'Something went wrong', status: 500 };
//   }
// };
export const approvedEnrollmentStep1Action = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    await updateEnrollmentById(data.EId, { step: 2 });
    // await sendEmailWithPDF(checkE);
    return { message: 'Student has been completed step 2.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const approvedEnrollmentStep2Action = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'Id is not valid', status: 403 };
    if (data.studentType === 'regular') {
      const checkBlock = await getBlockTypeById(data.blockType);
      if (!checkBlock) return { error: 'Block Type is not valid', status: 403 };
    }
    data.step = 3;
    if (data.blockType === '') {
      data.blockType = null;
    }

    // const checkSY = await getSchoolYearByYear(data.schoolYear);
    // if (!checkSY) return { error: 'SchoolYear is not valid', status: 403 };

    // @ts-ignore
    const updateP = await StudentProfile.findByIdAndUpdate(checkE.profileId._id, { studentType: data.studentType });
    if (!updateP) {
      return { error: 'There must be a problem in updating student profile.', status: 500 };
    }
    await updateEnrollmentById(data.EId, { step: 3, blockTypeId: data.blockType, schoolYear: data.schoolYear });
    // const pdf = await sendEmailWithPDF(checkE);
    return { message: 'Student has been completed step 2.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const approvedEnrollmentStep3Action = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    await updateEnrollmentById(data.EId, { step: 4 });
    return { message: 'Student has been completed step 3.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const approvedEnrollmentStep4Action = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    await updateEnrollmentById(data.EId, { step: 5 });
    return { message: 'Student has been completed step 4.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const approvedEnrollmentStep5Action = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    await updateEnrollmentById(data.EId, { step: 6 });
    // @ts-ignore
    const updatedProfile = await StudentProfile.findByIdAndUpdate(checkE.profileId._id, { payment: true });
    return { message: 'Student has been completed step 5.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const approvedEnrollmentStep6Action = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    await updateEnrollmentById(data.EId, { enrollStatus: 'Enrolled' });
    // @ts-ignore
    const b = await StudentCurriculum.findOne({ studentId: checkE.profileId._id, courseId: checkE.courseId._id });
    if (!b) {
      //@ts-ignore
      const createSC = await createStudentCurriculum({ studentId: enrollment.profileId._id, courseId: enrollment.courseId._id });
      if (!createSC) {
        return { error: 'There must be a problem in the creating Curriculum.', status: 500 };
      }
    }
    // @ts-ignore
    const updatedProfile = await StudentProfile.findByIdAndUpdate(checkE.profileId._id, { enrollStatus: 'Enrolled' });
    return { message: 'Student has been completed all steps.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

const sendEmailWithPDF = async (checkE: any) => {
  try {
    const pdfBase64 = await createPDF(checkE);
    if (pdfBase64) {
      const checkingEUpdate = await getEnrollmentById(checkE._id);
      if (!checkingEUpdate) return { error: 'Something went wrong.', status: 500 };
      const newE = JSON.parse(JSON.stringify(checkingEUpdate));
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'emonawong22@gmail.com',
          pass: 'nouv heik zbln qkhf',
        },
      });
      try {
        // Construct the data URI for the inline PDF attachment
        const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;
        const mailOptions = {
          from: 'asdklj',
          to: 'marzvelasco73019@gmail.com',
          subject: 'my subject',
          html: '<h1>Example Content </h1>',
          attachments: [
            {
              filename: `${newE.profileId.firstname} ${newE.profileId.middlename} ${newE.profileId.lastname}.pdf`,
              content: pdfDataUri,
              encoding: 'base64',
              contentType: 'application/pdf',
              path: `${newE.pdfUrl}`,
            },
          ],
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
      }
    }
    console.log('Email sent successfully');
    return;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const undoEnrollmentToStep1 = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    if (checkE.step === 2) {
      data.step = (checkE.step as number) - 1;
      const updated = await updateEnrollmentById(data.EId, { ...data, $unset: { blockTypeId: 1 } });
    }
    return { message: 'Student has been undo to step 1.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const undoEnrollmentToStep2 = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    if (checkE.step === 3) {
      data.step = (checkE.step as number) - 1;
      const updated = await updateEnrollmentById(data.EId, { ...data });
    }
    return { message: 'Student has been undo to step 2.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const undoEnrollmentToStep3 = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    if (checkE.step === 4) {
      data.step = (checkE.step as number) - 1;
      const updated = await updateEnrollmentById(data.EId, { ...data });
    }
    return { message: 'Student has been undo to step 3.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const undoEnrollmentToStep4 = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    if (checkE.step === 5) {
      data.step = (checkE.step as number) - 1;
      const updated = await updateEnrollmentById(data.EId, { ...data });
    }
    return { message: 'Student has been undo to step 4.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

//separate for adding subjects/schedules in student

export const getEnrollmentByIdAction = async (id: any): Promise<getSingleEnrollmentResponse> => {
  try {
    await dbConnect();
    const enrollment = await getEnrollmentById(id);
    return { enrollment: JSON.parse(JSON.stringify(enrollment)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getAllEnrollmentByTeacherScheduleIdAction = async (id: string): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const enrollments = await getAllEnrollmentByTeacherScheduleId(id);
    return { enrollment: JSON.parse(JSON.stringify(enrollments)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const CollegeEndSemesterAction = async (data: any) => {
  try {
    setProgress(0);
    await dbConnect();
    setProgress(10);
    const eSetup = await getEnrollmentSetupByName('GODOY');
    const teacherSchedule = await getAllTeacherSchedule();
    const filteredSchedule = teacherSchedule.filter((ts) => ts.category === 'College');
    const enrollments = await getAllEnrollment(data.category);
    const filterEnrolledEnrollments = enrollments.filter((en) => en.enrollStatus === 'Enrolled');
    setProgress(15);

    let teacherSchededRecord = [];
    for (const sched of filteredSchedule) {
      if (sched.blockTypeId || !sched.blockTypeId === undefined || !sched.blockTypeId === null) {
        const processedScheduleRecord = {
          category: sched.category,
          schoolYear: eSetup.enrollmentTertiary.schoolYear,
          profileId: sched.profileId,
          course: sched.courseId.name,
          courseCode: sched.courseId.courseCode,
          blockType: {
            year: sched.blockTypeId?.year,
            semester: sched.blockTypeId?.semester,
            section: sched.blockTypeId?.section,
          },
          subject: {
            fixedRateAmount: sched.subjectId?.fixedRateAmount,
            preReq: sched.subjectId.preReq,
            category: sched.subjectId.category,
            subjectCode: sched.subjectId.subjectCode,
            name: sched.subjectId.name,
            lec: sched.subjectId.lec,
            lab: sched.subjectId.lab,
            unit: sched.subjectId.unit,
          },
          days: sched.days,
          startTime: sched.startTime,
          room: {
            roomName: sched.roomId.roomName,
          },
          endTime: sched.endTime,
          studentsInClass: <any>[],
        };
        for (const studentEnrollment of filterEnrolledEnrollments) {
          //@ts-ignore
          for (const studentSubject of studentEnrollment.studentSubjects) {
            if (studentSubject.teacherScheduleId._id.toString() === sched._id.toString()) {
              if (studentSubject.status === 'Approved') {
                const processedStudentInClassRecord = {
                  student: {
                    firstname: studentSubject.profileId?.firstname,
                    middlename: studentSubject.profileId?.middlename,
                    lastname: studentSubject.profileId?.lastname,
                    extensionName: studentSubject.profileId?.extensionName,
                    sex: studentSubject.profileId?.sex,
                  },
                  grade: studentSubject.grade,
                };
                processedScheduleRecord.studentsInClass.push(processedStudentInClassRecord);
              }
            }
          }
        }
        teacherSchededRecord.push(processedScheduleRecord);
      }
    }
    setProgress(35);
    let enrollmentRecords = [];
    for (const enrollment of filterEnrolledEnrollments) {
      const processedRecord = {
        category: 'College',
        // @ts-ignore
        profileId: enrollment.profileId._id,
        // @ts-ignore
        course: enrollment.courseId.name,
        // @ts-ignore
        courseCode: enrollment.courseId.courseCode,
        // @ts-ignore
        blockType: {
          // @ts-ignore
          year: enrollment.blockTypeId?.year,
          // @ts-ignore
          semester: enrollment.blockTypeId?.semester,
          // @ts-ignore
          section: enrollment.blockTypeId?.section,
        },
        // @ts-ignore
        studentType: enrollment.profileId.studentType,
        studentYear: enrollment.studentYear,
        studentSemester: enrollment.studentSemester,
        schoolYear: enrollment.schoolYear,
        enrollStatus: enrollment.enrollStatus,
        studentStatus: enrollment.studentStatus,
        createdAt: new Date(),
        studentSubjects: <any>[],
        // Add any additional fields required by your EnrollmentRecord model
      };
      let studentSubjects = [];
      //@ts-ignore
      for (const ss of enrollment.studentSubjects) {
        const processedSubjectRecord = {
          // @ts-ignore
          subject: {
            id: ss.teacherScheduleId?.subjectId?._id,
            fixedRateAmount: ss.teacherScheduleId?.subjectId?.fixedRateAmount,
            preReq: ss.teacherScheduleId.subjectId.preReq,
            category: ss.teacherScheduleId.subjectId.category,
            subjectCode: ss.teacherScheduleId.subjectId.subjectCode,
            name: ss.teacherScheduleId.subjectId.name,
            lec: ss.teacherScheduleId.subjectId.lec,
            lab: ss.teacherScheduleId.subjectId.lab,
            unit: ss.teacherScheduleId.subjectId.unit,
          },
          teacher: {
            firstname: ss.teacherScheduleId.profileId.firstname,
            middlename: ss.teacherScheduleId.profileId.middlename,
            lastname: ss.teacherScheduleId.profileId.lastname,
            extensionName: ss.teacherScheduleId.profileId.extensionName,
            sex: ss.teacherScheduleId.profileId.sex,
          },
          blockType: {
            year: ss.teacherScheduleId.blockTypeId.year,
            semester: ss.teacherScheduleId.blockTypeId.semester,
            section: ss.teacherScheduleId.blockTypeId.section,
          },
          days: ss.teacherScheduleId.days,
          startTime: ss.teacherScheduleId.startTime,
          endTime: ss.teacherScheduleId.endTime,
          room: {
            roomName: ss.teacherScheduleId.roomId.roomName,
          },
          status: ss.status,
          request: ss.request,
          requestStatusInDean: ss.requestStatusInDean,
          requestStatusInRegistrar: ss.requestStatusInRegistrar,
          requestStatus: ss.requestStatus,

          profileId: ss.profileId?._id,
          grade: ss.grade,
        };

        studentSubjects.push(processedSubjectRecord);
      }
      processedRecord.studentSubjects = studentSubjects;

      let studentCurriculum;
      //@ts-ignore
      const b = await StudentCurriculum.findOne({ studentId: enrollment.profileId._id, courseId: enrollment.courseId._id });
      if (b) {
        studentCurriculum = b;
      } else if (!b) {
        //@ts-ignore
        studentCurriculum = await createStudentCurriculum({ studentId: enrollment.profileId._id, courseId: enrollment.courseId._id });
      }
      const curriculumExists = studentCurriculum.curriculum.some((c: any) => c.year === enrollment.studentYear && c.semester === enrollment.studentSemester);
      if (curriculumExists) {
        for (const curriculum of studentCurriculum.curriculum) {
          let updateSubjects = [];

          if (curriculum.year === enrollment.studentYear && curriculum.semester === enrollment.studentSemester) {
            for (const studentS of studentSubjects) {
              if (studentS.status === 'Approved') {
                let subjectFound = false;
                for (const subject of curriculum.subjectsFormat) {
                  if (studentS.subject.id.toString() === subject.subjectId._id.toString()) {
                    subject.grade = studentS.grade;
                    subjectFound = true;
                    break;
                  }
                }
                if (!subjectFound) {
                  updateSubjects.push({
                    subjectId: studentS.subject.id,
                    grade: studentS.grade ? studentS.grade : 'INC',
                  });
                }
              }
            }
            if (updateSubjects.length > 0) {
              await StudentCurriculum.updateOne({ 'curriculum._id': curriculum._id }, { $push: { 'curriculum.$.subjectsFormat': { $each: updateSubjects } } });
            }
          }
        }
      } else {
        let newSubjects = [];
        for (const studentS of studentSubjects) {
          console.log('studentSubjects', studentS);
          if (studentS.status === 'Approved') {
            newSubjects.push({
              subjectId: studentS.subject.id,
              grade: studentS.grade ? studentS.grade : 'INC',
            });
          }
        }
        const newC = {
          schoolYear: enrollment.schoolYear,
          year: enrollment.studentYear,
          semester: enrollment.studentSemester,
          subjectsFormat: newSubjects,
        };
        await studentCurriculum.curriculum.push(newC);
      }
      await studentCurriculum.save();
      enrollmentRecords.push(processedRecord);
    }
    setProgress(70);

    const courses = await Course.find({ category: 'College' }).select('_id');
    const courseIds = courses.map((course) => course._id);

    await StudentProfile.updateMany({ courseId: { $in: courseIds }, studentStatus: 'Continue', enrollStatus: { $in: ['', 'Pending'] } }, { $set: { studentStatus: 'Returning', enrollStatus: '' } }, { new: true });
    await StudentProfile.updateMany({ courseId: { $in: courseIds }, studentStatus: 'New Student', enrollStatus: 'Pending' }, { $set: { enrollStatus: '' } }, { new: true });
    // Use insertMany for bulk insertion
    await TeacherScheduleRecord.insertMany(teacherSchededRecord);
    setProgress(75);
    await EnrollmentRecord.insertMany(enrollmentRecords);
    setProgress(80);
    await Enrollment.deleteMany({ category: 'College' });
    setProgress(85);
    
    await ReportGrade.deleteMany({ category: 'College' });
    setProgress(90);

    if (data.deleteInstructor) {
      /**
       * @todo this blockType model is the same as we do at line 566
       */
      await BlockType.updateMany({ category: 'College' }, { $set: { blockSubjects: [] } }, { new: true });
      await TeacherSchedule.deleteMany({ category: 'College' });
    }
  
    await StudentProfile.updateMany({ courseId: { $in: courseIds }, enrollStatus: 'Enrolled' }, { $set: { studentStatus: 'Continue', enrollStatus: '' } }, { new: true });
    setProgress(95);
    const enrollmentTertiary = {
      open: false,
      schoolYear: '',
      semester: '',
    };
    await updateEnrollmentSetupByName('GODOY', { enrollmentTertiary });
    setProgress(100);
    return { message: 'asd', status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
