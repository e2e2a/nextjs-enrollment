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

export const createActiveIp = async (userId: any, ip: string) => {
  await UserIp.create({
      userId: userId,
      ips: [{ address: ip }],
  });
  return true;
};

export const updateActiveIp = async (userId: string, ip: string) => {
  const existingActiveIp = await getActiveIpByUserId(userId);

  if (existingActiveIp) {
    const activeIp = await UserIp.findOne({ userId: userId, 'ips.address': ip });
    if (!activeIp) {
      existingActiveIp.ips.push({ address: ip });
      existingActiveIp.updatedAt = new Date();
      await existingActiveIp.save();
      console.log(`Updated IP for userId ${userId} to ${ip}`);
      return true;
    }
    await createActiveIp(userId, ip);
    console.log(`Updated IP for userId ${userId} to ${ip}`);
    return true;
  }

  return false;
};
