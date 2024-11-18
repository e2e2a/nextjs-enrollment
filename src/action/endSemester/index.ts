'use server';
import dbConnect from '@/lib/db/db';
import { getEnrollmentByCategory, getEnrollmentById } from '@/services/enrollment';
// import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { createPDF } from '../createPdf';
import StudentProfile from '@/models/StudentProfile';
import EnrollmentRecord from '@/models/EnrollmentRecord';
import { getAllTeacherSchedule } from '@/services/teacherSchedule';
import TeacherScheduleRecord from '@/models/TeacherScheduleRecord';
import { getEnrollmentSetupByName, updateEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import ReportGrade from '@/models/ReportGrade';
import Enrollment from '@/models/Enrollment';
import TeacherSchedule from '@/models/TeacherSchedule';
import Course from '@/models/Course';
import BlockType from '@/models/BlockType';
import { getTeacherScheduleRecordData } from './helpers/getTeacherScheduleRecordData';
import { getEnrollmentRecordData } from './helpers/getEnrollmentRecordData';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';
// import { verificationTemplate } from './emailTemplate/verificationTemplate';

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
              filename: `${newE.profileId.firstname} ${newE.profileId.middlename ?? ''} ${newE.profileId.lastname}.pdf`,
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

export const EndSemesterAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN') return { error: 'Not authenticated.', status: 403 };

    const a = await checkCategory(data);
    return a;
  });
};

const checkCategory = async (data: any) => {
  return tryCatch(async () => {
    switch (data.category) {
      case 'College':
        return await handleCategoryCollege(data);
      case '2':
        return { message: '2', status: 201 };
      default:
        return { error: 'Invalid category.', status: 400 };
    }
  });
};

const handleCategoryCollege = async (data: any) => {
  return tryCatch(async () => {
    const eSetup = await getEnrollmentSetupByName('GODOY');
    const teacherSchedule = await getAllTeacherSchedule();
    const filteredSchedule = teacherSchedule.filter((ts) => ts.category === 'College');
    const enrollments = await getEnrollmentByCategory(data.category);
    const filterEnrolledEnrollments = enrollments.filter((en) => en.enrollStatus === 'Enrolled' || en.enrollStatus === 'Temporary Enrolled');

    // new added
    const tsRecordData = await getTeacherScheduleRecordData(filteredSchedule, filterEnrolledEnrollments, eSetup.enrollmentTertiary);

    const enRecordData = await getEnrollmentRecordData(filterEnrolledEnrollments);

    const courses = await Course.find({ category: 'College' }).select('_id');
    const courseIds = courses.map((course) => course._id);

    // Use bulk operation
    await StudentProfile.updateMany({ courseId: { $in: courseIds }, studentStatus: 'Continue', enrollStatus: { $in: ['', 'Pending'] } }, { $set: { studentStatus: 'Returning', enrollStatus: '' } }, { new: true });
    await StudentProfile.updateMany({ courseId: { $in: courseIds }, studentStatus: 'New Student', enrollStatus: 'Pending' }, { $set: { enrollStatus: '' } }, { new: true });
    await TeacherScheduleRecord.insertMany(tsRecordData.data);
    await EnrollmentRecord.insertMany(enRecordData.data);
    await Enrollment.deleteMany({ category: 'College' });

    await ReportGrade.deleteMany({ category: 'College' });

    if (data.deleteInstructor) {
      await BlockType.updateMany({ category: 'College' }, { $set: { blockSubjects: [] } }, { new: true });
      await TeacherSchedule.deleteMany({ category: 'College' });
    }

    await StudentProfile.updateMany({ courseId: { $in: courseIds }, enrollStatus: 'Enrolled' }, { $set: { studentStatus: 'Continue', enrollStatus: '' } }, { new: true });

    const enrollmentTertiary = { open: false, schoolYear: '', semester: '' };
    await updateEnrollmentSetupByName('GODOY', enrollmentTertiary);

    return { success: true, message: `Category ${data.category}-${eSetup.enrollmentTertiary.semester}-${eSetup.enrollmentTertiary.schoolYear} has been ended.`, status: 201 };
  });
};
