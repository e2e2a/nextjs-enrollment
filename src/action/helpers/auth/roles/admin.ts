'use server';
import { checkAuth } from '..';

export const verifyAdmin = async () => {
  const session = await checkAuth();
  if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
  if (session && session.user.role !== 'ADMIN') return { error: '', status: 401 };
  return { session: session, status: 200 };
};
