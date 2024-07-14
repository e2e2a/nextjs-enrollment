'use server';
import db from '@/lib/db';

export const getActiveIpByUserId = async (userId: string) => {
  try {
    const activeIp = await db.activeIp.findFirst({
      where: {
        userId: userId,
      },
    });
    return activeIp;
  } catch (error) {
    return null;
  }
};

export const createActiveIp = async (userId: any, ip: string) => {
  await db.activeIp.create({
    data: {
      userId: userId,
      ip: [ip],
    },
  });
  return true;
};

export const updateActiveIp = async (userId: string, ip: string) => {
  const existingActiveIp = await getActiveIpByUserId(userId);

  if (existingActiveIp) {
    const currentIpArray = existingActiveIp.ip || [];

    const updatedIpArray = [...currentIpArray, ip];
    await db.activeIp.update({
      where: { id: existingActiveIp.id },
      data: {
        ip: updatedIpArray,
        updatedAt: new Date(),
      },
    });
    console.log(`Updated IP for userId ${userId} to ${ip}`);
    return true;
  }

  return false;
};
