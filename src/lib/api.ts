// import { z } from 'zod';
// import { QueryFunctionContext } from '@tanstack/react-query';
// // import { fetchURL } from './helpers/fetchUrl';

// interface Idata {
//   email: string;
//   verificationCode?: string;
// }

// export const fetchRecoveryEmail = async (data: Idata) => {
//   const res = await fetchURL('/api/auth/recovery', 'POST', 'Failed to find the email. Please try again a few minutes.');

//   return res;
// };

// interface tokenCheck {
//   token: string;
// }

// // export const fetchTokenEmail = async ({ queryKey }: QueryFunctionContext) => {
// //   const [_key, data] = queryKey as [string, tokenCheck];
// //   const res = await fetchURL('/api/token', 'POST', 'Failed to check token. Please try again a few minutes.', data);

// //   return res;
// // };

// // ============================================================
// // AUTH Recovery
// // ============================================================

// export const fetchRecoveryTokenEmail = async ({ queryKey }: QueryFunctionContext) => {
//   const [_key, data] = queryKey as [string, tokenCheck];
//   const res = await fetchURL(
//     '/api/auth/reset-password-token',
//     'POST',
//     'Failed to check token. Please try again a few minutes.',
//     data
//   );

//   return res;
// };

// // export const fetchNewPassword = async (data: z.infer<typeof NewPasswordValidator>) => {
// //   const res = await fetchURL(
// //     '/api/auth/recovery/reset-password',
// //     'POST',
// //     'Failed to create new password. Please try again a few minutes.',
// //     data
// //   );

// //   return res;
// // };
// // review
// export const fetchAllUsers = async () => {
//   const res = await fetchURL('/api/users', 'GET', 'Failed to fetch all users. Please try again a few minutes.');

//   return res;
// };
// export const fetchAllEnrollments = async () => {
//   const res = await fetchURL('/api/enrollment/step1', 'GET', 'Failed to fetch all users. Please try again a few minutes.');

//   return res;
// };
