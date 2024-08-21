'use server';
import dbConnect from '@/lib/db/db';
import { getEnrollmentById, getEnrollmentByStep } from '@/services/enrollment';
import { getEnrollmentResponse } from '@/types';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Resend } from 'resend';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createPDF } from '../createPdf';
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
    console.log('server e :', data);
    await dbConnect();
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE) return { error: 'There must be a problem in the enrollment of user.', status: 500 };
    sendEmailWithPDF(checkE);
    // next step is to update the data in enrollment by using checkE._id
    // deliver a notification
    // and deliver a email notification
    // last step is to send an email notification with pdf file
    // console.log('server e :', checkE);
    return { enrollment: [], status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

const sendEmailWithPDF = async (checkE: any) => {
  try {
    const pdfBase64 = await createPDF(checkE);
    // const filePath = path.join(__dirname, 'pdf', '../../../../../../../../public/pdf/exampldPDF.pdf');
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: 'emonawong22@gmail.com',
    //     pass: 'nouv heik zbln qkhf',
    //   },
    // });
    // try {
    //   // Construct the data URI for the inline PDF attachment
    //   const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;
    //   const mailOptions = {
    //     from: 'asdklj',
    //     to: 'marzvelasco73019@gmail.com',
    //     subject: 'my subject',
    //     html: '<h1>Example Content </h1>',
    //     attachments: [
    //       {
    //         filename: `eeee.pdf`,
    //         content: pdfDataUri,
    //         encoding: 'base64',
    //         contentType: 'application/pdf',
    //         path: `http://localhost:3000/pdf/exampldPDF1.pdf`,
    //       },
    //     ],
    //   };
    //   const info = await transporter.sendMail(mailOptions);
    //   console.log('Email sent:', info.response);
    // } catch (error) {
    //   console.error('Error sending email:', error);
    //   throw new Error('Failed to send email');
    // }
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }

};
