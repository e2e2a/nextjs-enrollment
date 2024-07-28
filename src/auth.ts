import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { getUserByEmail, getUserById, updateUserLogin } from './services/user';
import {User} from './models/User';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import dbConnect from './lib/db/db';
import { MongoClient } from 'mongodb';
import Account from './models/Account';
import { createStudentProfile, createStudentProfileProvider } from './services/studentProfile';
import { createAccount } from './services/account';
const clientPromise = MongoClient.connect(process.env.MONGODB_URI!);

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: 'sign-in',
    error: 'auth',
  },
  events: {
    async linkAccount({ user, profile }) {
      await dbConnect();
      await User.findByIdAndUpdate(user.id, {
        emailVerified: new Date(),
        lastLogin: new Date(),
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();
        if (account?.provider === 'google') {
          const existingUser = await getUserByEmail(user.email!);
          if (existingUser) {
            const existAccount = await Account.findOne({ userId: existingUser._id });
            if (!existAccount) {
              await createAccount(account, existingUser._id as string);
            }
            await updateUserLogin(existingUser._id);
            return true;
            // return false;
          }
          const userData = {
            email: profile?.email,
            imageUrl: profile?.picture,
          };
          const newUser = await User.create({
            ...userData,
          });
          await createAccount(account, newUser._id as string);
          await updateUserLogin(newUser._id as string);
          await createStudentProfileProvider(profile);
          return true;
        } else if (account?.provider === 'credentials') {
          // @ts-ignore
          const existingUser = await getUserById(user._id);

          // Prevent sign-in without email verification
          if (!existingUser || !existingUser.emailVerified) {
            return false;
          }
          await updateUserLogin(existingUser._id);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error during signIn callback:', error);
        return false; // Return false for any error
      }
    },
    async session({ session, token }) {
      await dbConnect();
      if (token && session.user) {
        if (token.sub) {
          const user = await getUserById(token.sub);
          if (user) {
            session.user.id = user._id;
            session.user.firstname = user.firstname;
            session.user.lastname = user.lastname;
            session.user.imageUrl = user.imageUrl;
            session.user.role = user.role;
            session.user.birthday = new Date(user.birthday);
            if (user.birthday) {
            }
          }
          // if (token.role) {
          //   session.user.role = token.role;
          // }
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      await dbConnect();
      // @ts-ignore
      if (user) token.sub = user._id;
      if (!user && token.email) {
        const existUser = await getUserByEmail(token.email);
        token.sub = existUser._id;
      }
      // if (account) {
      //   token.sub = account.id;
      // }
      if (token.sub) {
        const existUser = await getUserById(token.sub);
        if (!existUser) return token;

        token.role = existUser.role;
      }

      return token;
    },
  },
  //we cant remove this adapter 
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  ...authConfig,
});
