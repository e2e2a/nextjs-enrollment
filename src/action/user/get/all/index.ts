'use server';
import dbConnect from '@/lib/db/db';
import { getAllUsers } from '@/services/user';

export const getAllUsersAction = async (): Promise<any> => {
  try {
    await dbConnect();
    const users = await getAllUsers();
    return { users: JSON.parse(JSON.stringify(users)), status: 200 };
  } catch (error) {
    console.log('getAllUsersAction', error);
    return { error: '', status: 500 };
  }
};