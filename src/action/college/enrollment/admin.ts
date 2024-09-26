'use server';
import dbConnect from '@/lib/db/db';
import { getAllEnrollment, getAllEnrollmentByTeacherScheduleId, getEnrollmentById, getEnrollmentByStep, updateEnrollmentById } from '@/services/enrollment';
import { getEnrollmentResponse, getSingleEnrollmentResponse } from '@/types';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { createPDF } from '../../createPdf';
import { getBlockTypeById } from '@/services/blockType';
import { getSchoolYearByYear } from '@/services/schoolYear';
// import { verificationTemplate } from './emailTemplate/verificationTemplate';
export const getAllEnrollmentAction = async (): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const enrollments = await getAllEnrollment();
    return { enrollment: JSON.parse(JSON.stringify(enrollments)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
export const getEnrollmentByStepAction = async (userId: any): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const enrollments = await getEnrollmentByStep(userId);
    return { enrollment: enrollments, status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const approvedEnrollmentStep1Action = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'Id is not valid', status: 403 };
    const checkBlock = await getBlockTypeById(data.blockType);
    if (!checkBlock) return { error: 'Block Type is not valid', status: 403 };
    // const checkSY = await getSchoolYearByYear(data.schoolYear);
    // if (!checkSY) return { error: 'SchoolYear is not valid', status: 403 };
    // console.log('check:', checkSY);
    await updateEnrollmentById(data.EId, { step: 2, blockTypeId: data.blockType, schoolYear: data.schoolYear });
    // const pdf = await sendEmailWithPDF(checkE);
    return { message: 'Student has been completed step 1.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const approvedEnrollmentStep2Action = async (data: any) => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    await updateEnrollmentById(data.EId, { step: 3 });
    // await sendEmailWithPDF(checkE);
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
    await updateEnrollmentById(data.EId, { enrollStatus: 'Enrolled' });
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