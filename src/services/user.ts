'use server';
import db from '@/lib/db';
import { deleteResetPasswordTokenByEmail } from './reset-password';
import { deleteVerificationTokenByEmail } from './verification-token';
import { hashPassword } from '@/lib/hash/bcrypt';

type IId = {
  id: string;
};

type IUserEmail = {
  email: string;
};

type IUserPassword = {
  password: string;
};

type IUserEmailVerified = IId & {
  emailVerified: Date;
};

type INewUser = IUserEmail & {
  firstname: string;
  lastname: string;
  username: string;
} & IUserPassword;

type IUpdateUserPassword = IId & IUserPassword;

export const createUser = async (data: INewUser) => {
  try {
    const { password, ...userData } = data;
    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    throw new Error(`${error}`);
    // return null;
  }
};

export const getUsers = async () => {
  const users = await db.user.findMany();
  return users;
};

export const checkUserUsername = async (username: string) => {
  const users = await db.user.findMany({
    where: {
      username,
      emailVerified: {
        not: null,
      },
    },
  });
  console.log(`${users}`);
  if (users && users.length > 0) return true;
  return false;
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = db.user.findUnique({
      where: {
        email: email,
      },
      include:{ activeIp: true}
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};
/**
 * @todo
 */
export const deleteUserByEmail = async (email: string) => {
  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.emailVerified) {
    return null;
  }

  await db.user.delete({
    where: {
      email: email,
    },
  });
  return existingUser;
};

/**
 * @todo use the type in the update
 */
export const updateUserEmailVerifiedById = async (id: string) => {
  await db.user.update({
    where: { id: id },
    data: {
      emailVerified: new Date(),
    },
  });
};

export const updateUserIpById = async (id: string, ip: string) => {
  // const user = await getUserById(id);
  const user = await db.user.findUnique({
    where: {
      id:id,
    },
    include: {activeIp: true}
  });
  if (!user) return null;
  // const existingActiveIp = await db.activeIp.findUnique({
  //   where: {
  //     userId: user.id,
  //   },
  //   data: {
  //     ip: { equals: [ip] },
  //   },
  // });

  const existingActiveIp = await db.activeIp.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (existingActiveIp) {
    const currentIpArray = existingActiveIp.ip || [];
    if (currentIpArray.includes(ip)) {
      // Do nothing if the IP is already the same
      console.log(`ActiveIp entry for userId ${user.id} already exists with IP ${ip}`);
    } else {
      // Update the existing ActiveIp entry with the new IP
      const updatedIpArray = [...currentIpArray, ip];
      await db.activeIp.update({
        where: { id: existingActiveIp.id },
        data: {
          ip: updatedIpArray,
          updatedAt: new Date(),
        },
      });
      console.log(`Updated IP for userId ${user.id} to ${ip}`);
    }
  }

  return user
};

export const updateUserPasswordById = async (data: IUpdateUserPassword) => {
  try {
    const { id, password } = data;
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error('Could not find user');
    }

    const hashedPassword = await hashPassword(password);

    const newPassword = await db.user.update({
      where: {
        id: existingUser?.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return newPassword;
  } catch (error) {
    throw new Error('Failed to create user');
  }
};
