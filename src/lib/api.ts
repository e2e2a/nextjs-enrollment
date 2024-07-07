import { z } from 'zod';
import { NewPasswordValidator, SigninValidator, SignupValidator } from './validators/Validator';
import { QueryFunctionContext } from '@tanstack/react-query';
import { fetchURL } from './helpers/fetchUrl';

// ============================================================
// AUTH fetch
// ============================================================
export const fetchSignUp = async (data: z.infer<typeof SignupValidator>) => {
  const res = await fetchURL(data, `/api/auth/sign-up`, 'POST', 'Failed to sign up. Please try again a few minutes.');
  
  return res;
};

export const fetchSignIn = async (data: z.infer<typeof SigninValidator>) => {
  const res = await fetchURL(data, '/api/auth/sign-in', 'POST', 'Failed to sign in. Please try again a few minutes.');

  return res;
};

interface Idata {
  email: string;
  verificationCode?: string;
}

export const fetchVerficationCode = async (data: Idata) => {
  const res = await fetchURL(data, '/api/auth/verification', 'POST', 'Failed to Verify. Please try again a few minutes.');

  return res;
};

export const fetchResendVCode = async (data: Idata) => {
  const res = await fetchURL(data, '/api/auth/verification/resend', 'POST', 'Failed to Resend Code. Please try again a few minutes.');

  return res;
};

export const fetchRecoveryEmail = async (data: Idata) => {
  const res = await fetchURL(data, '/api/auth/recovery', 'POST', 'Failed to find the email. Please try again a few minutes.');

  return res;
};

interface tokenCheck {
  token: string;
}

export const fetchTokenEmail = async ({ queryKey }: QueryFunctionContext) => {
  const [_key, data] = queryKey as [string, tokenCheck];
  const res = await fetchURL(data, '/api/token', 'POST', 'Failed to check token. Please try again a few minutes.');

  return res;
};

// ============================================================
// AUTH Recovery
// ============================================================

export const fetchRecoveryTokenEmail = async ({ queryKey }: QueryFunctionContext) => {
  const [_key, data] = queryKey as [string, tokenCheck];
  const res = await fetchURL(data, '/api/auth/reset-password-token', 'POST', 'Failed to check token. Please try again a few minutes.');

  return res;
};

export const fetchNewPassword = async (data: z.infer<typeof NewPasswordValidator>) => {
  const res = await fetchURL(data, '/api/auth/recovery/reset-password', 'POST', 'Failed to create new password. Please try again a few minutes.');
  
  return res;
};