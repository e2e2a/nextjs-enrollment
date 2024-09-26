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
  try {
    await UserIp.create({
      userId: userId,
      ips: [{ address: ip }],
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateActiveIp = async (userId: string, ip: string) => {
  const existingActiveIp = await getActiveIpByUserId(userId);
  console.log('exit activeIp', existingActiveIp);
  if (existingActiveIp) {
    const activeIp = await UserIp.findOne({ userId: userId, 'ips.address': ip });
    if (activeIp) {
      // existingActiveIp.ips.push({ address: ip });
      // existingActiveIp.updatedAt = new Date();
      // await existingActiveIp.save();
      // console.log(`Updated IP for userId ${userId} to ${ip}`);
      // return true;
      activeIp.ips.push({ address: ip });
      activeIp.updatedAt = new Date();
      await activeIp.save(); // Save the updated document
      console.log(`Updated IP for userId ${userId} to ${ip}`);
      return true;
    }
    console.log(`Updated IP for userId ${userId} to ${ip}`);
    return true;
  } else {
    await createActiveIp(userId, ip);
  }

  return false;
};
