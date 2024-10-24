'use server';
import { auth } from '@/auth';
import { getUserById } from '@/services/user';

export const checkAuth = async () => {
  const session = await auth();
  if (!session) return { error: 'Forbidden', status: 401 };
  const user = await getUserById(session?.user.id);
  return { user: user, status: 200 };
};
