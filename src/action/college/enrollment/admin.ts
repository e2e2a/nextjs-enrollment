'use server';
import dbConnect from '@/lib/db/db';
import { getEnrollmentById, getEnrollmentByStep, updateEnrollmentById } from '@/services/enrollment';
import { getEnrollmentResponse } from '@/types';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { createPDF } from '../../createPdf';
// import { verificationTemplate } from './emailTemplate/verificationTemplate';
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

export const approvedEnrollmentStep1Action = async (data: any): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'id not valid', status: 500 };
    // const pdf = await sendEmailWithPDF(checkE);
    await updateEnrollmentById(data.EId, { step: 2, blockType: data.blockType });

    return { enrollment: [], status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const approvedEnrollmentStep2Action = async (data: any): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    await sendEmailWithPDF(checkE);
    return { enrollment: [], status: 200 };
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

export const undoEnrollmentToStep = async (data: any): Promise<getEnrollmentResponse> => {
  try {
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    data.step = checkE.step as number - 1;
    data.blockType = '';
    const updated = await updateEnrollmentById(data.EId, { ...data });
    console.log('success', updated);
    return { enrollment: [], status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
