'use server';
import { parentsTemplate } from './emailTemplate/parentsTemplate';
// import { Resend } from 'resend';
import { verificationTemplate } from './emailTemplate/verificationTemplate';
import nodemailer from 'nodemailer';
/**
 *
 * @todo
 * 1. i will use this resend if i have a domain email address
 *
 */
// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendVerificationEmail = async (email: string, verificationCode: string, firstname: string, resendHeader: string) => {
//   try {
//     const htmlContent = await verificationTemplate(verificationCode, firstname, resendHeader);
//     await resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: email,
//       subject: resendHeader,
//       html: htmlContent,
//     });
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

export const sendEmail = async (to: string, username: string, subject: string, type: string, verificationCodeOrToken: string, header: string) => {
  try {
    let htmlContent;
    if (!to || to === '' || to === null || to === null) return false;
    if (type !== 'auth') return false;

    htmlContent = await verificationTemplate(verificationCodeOrToken, username, header);

    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'emonawong22@gmail.com', pass: process.env.EMAIL_PASS } });

    const mailOptions = { from: 'nextjs-enrollment.vercel.app', to: to, subject, html: htmlContent };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:');
    return false;
  }
};

export const sendViewGradeEmail = async (to: string, studentName: string, parentName: string, subject: string, type: string, verificationToken: string, header: string) => {
  try {
    let htmlContent;
    if (!to || to === '' || to === null || to === null) return false;
    // if (type !== 'auth') return false;

    htmlContent = await parentsTemplate(verificationToken, studentName, parentName, header);

    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'emonawong22@gmail.com', pass: process.env.EMAIL_PASS } });

    const mailOptions = { from: 'nextjs-enrollment.vercel.app', to: to, subject, html: htmlContent };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:');
    return false;
  }
};
