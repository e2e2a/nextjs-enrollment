'use server';
import { checkAuth } from '..';

export const verifyADMIN = async () => {
  const session = await checkAuth();
  if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
  if (session && session.user.role !== 'ADMIN') return { error: 'Not Authorized', status: 401 };
  return { user: session.user, status: 200 };
};
