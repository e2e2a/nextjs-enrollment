'use server';
import { UserIp } from '@/models/UserIp';

export const getActiveIpByUserId = async (userId: string) => {
  try {
    const activeIp = await UserIp.findOne({ userId: userId });
    return activeIp;
  } catch (error) {
    return null;
  }
};

export const createActiveIp = async (userId: any, ip?: string) => {
  try {
    await UserIp.create({
      userId: userId,
      ...(ip ? { ips: [{ address: ip }] } : {}),
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateActiveIp = async (userId: string, ip: string) => {
  const activeIp = await UserIp.findOne({ userId: userId });
  if (activeIp) {
    const ipExists = activeIp.ips.some((ipEntry: any) => ipEntry.address === ip);
    if (!ipExists) {
      activeIp.ips.push({ address: ip });
    }
    activeIp.updatedAt = new Date();
    await activeIp.save();
    console.log(`Updated IP for userId ${userId} to ${ip}`);
    return true;
  }
};
