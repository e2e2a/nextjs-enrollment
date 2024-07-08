"use server"
import { getIpAddress } from './getIp';

export const checkingIp = async (user: any) => {
  try {
    const ip = await getIpAddress();
    console.log(ip);
    if (!user.activeIpAddress || user.activeIpAddress !== ip) {
      if (user.recentIpAddress && user.recentIpAddress !== ip) {
        return { error: 'Old ip detected!' };
      }
      return { error: 'New ip detected!' };
    }

    return { success: 'User using same ip.' };
  } catch (error) {
    return { error };
  }
};
