"use server"
import { Resend } from 'resend';
import { verificationTemplate } from './emailTemplate/verificationTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
  firstname: string,
  resendHeader: string
) => {
  const htmlContent = await verificationTemplate(verificationCode, firstname,resendHeader);
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: resendHeader,
    html: htmlContent,
  });
  return
};
