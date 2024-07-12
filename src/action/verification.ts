"use server"
import { signIn } from '@/auth';
import { getIpAddress } from '@/lib/helpers/getIp';
import { sendVerificationEmail } from '@/lib/helpers/mail';
import { generateVerificationCode } from '@/lib/helpers/verificationCode';
import { generateResetPasswordToken } from '@/services/reset-password';
import { getUserByEmail, updateUserEmailVerifiedById, updateUserIpById } from '@/services/user';
import { deleteVerificationTokenByid, getVerificationTokenByEmail } from '@/services/verification-token';
import { verificationCodeProcessResponse, verificationCodeResendResponse } from '@/types';

/**
 * Performs submitting verification code(6-digit) 
 * 
 * @param token string
 */

export const verificationCodeProcess = async (data: any): Promise<verificationCodeProcessResponse> => {
    const { email, verificationCode, Ttype } = data;
    try {
    const userToken = await getVerificationTokenByEmail(email);
      if (!userToken) return { error: 'Somethings went wrong', status: 403 };
  
      const hasExpired = new Date(userToken.expiresCode) < new Date();
      if (hasExpired) return { error: 'Verification Code has expired.',status: 410 };
  
      if (verificationCode !== userToken.code) return { error: 'Verification Code not match.', status: 403 };
  
      const user = await getUserByEmail(userToken.email);
      if (!user) return { error: 'User not found', status: 404  };
  
      switch (Ttype) {
        case 'Recovery':
          const RPtoken = await generateResetPasswordToken(email);
          await deleteVerificationTokenByid(userToken.id);
          return { token: RPtoken,  status: 201 };
  
        case 'Activation':
          const ip = await getIpAddress();
          if(!ip) return { error: 'Something went wrong!',status: 403 };
          await deleteVerificationTokenByid(userToken.id);
          await updateUserIpById(user.id, ip)
          await signIn('credentials', {
            email: user.email,
            redirect: false,
          });
  
          return { redirect: '/admin', status: 201  } ;
        case 'Verify':
          await updateUserEmailVerifiedById(user.id);
          await deleteVerificationTokenByid(userToken.id);
          return { redirect: '/sign-in', status: 201 };
        default:
          return { error: 'Invalid request type', status: 400 };
      }
    } catch (error) {
      return { error: 'Internal Server Error', status: 500 };
    }
  }

  export const verificationCodeResend = async (data: any): Promise<verificationCodeResendResponse> => {
      const { email } = data;
      const verification = await generateVerificationCode(email);
      if ('error' in verification) {
        return { error: 'Something went wrong.', status: 403 };
      }
      const User = await getUserByEmail(verification.email);
      if (!User) return { error: 'User not found', status: 403 };
      await sendVerificationEmail(
        verification.email,
        verification.code,
        User.firstname,
        'Resend Verification'
      );
      return { verification: verification, message: 'hello', status: 200 };
  }