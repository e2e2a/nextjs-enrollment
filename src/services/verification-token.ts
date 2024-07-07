import db from '@/lib/db';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const deleteVerificationTokenByEmail = async (email: string) => {
  try {
    await db.verificationToken.delete({
      where: {
        email: email,
      },
    });
    return;
  } catch (error) {
    return null;
  }
};

export const deleteVerificationTokenByid = async (id: string) => {
  try {
    await db.verificationToken.delete({
      where: {
        id,
      },
    });
    return;
  } catch (error) {
    return null;
  }
};