'use server';
import { checkAuth } from '..';

export const verifyDEAN = async () => {
  const session = await checkAuth();
  if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
  if (session && session.user.role !== 'DEAN') return { error: 'Not Authorized', status: 401 };
  return { user: session.user, status: 200 };
};
