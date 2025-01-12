import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { getUserByEmail, getUserById, updateUserLogin } from './services/user';
import { User } from './models/User';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import dbConnect from './lib/db/db';
import { MongoClient } from 'mongodb';
import Account from './models/Account';
import { createStudentProfileProvider } from './services/studentProfile';
import { createAccount } from './services/account';
import clientPromise from './lib/db/clientPromise';
// const clientPromise = MongoClient.connect(process.env.MONGODB_URI!);
// const clientPromise = dbConnect().then((mongoose) => mongoose.connection.getClient());

const isInProductionMode = process.env.NEXT_PUBLIC_NODE_ENV === 'production';

export const { auth, handlers, signIn, signOut } = NextAuth({
  cookies: {
    sessionToken: {
      name: isInProductionMode ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isInProductionMode,
      },
    },
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isInProductionMode,
      },
    },
  },
  debug: isInProductionMode,
  pages: {
    signIn: '/sign-in',
    error: '/auth',
  },
  events: {
    async signOut() {
      // add here
    },
    async linkAccount({ user, profile }) {
      await dbConnect();
      await User.findByIdAndUpdate(user.id, {
        emailVerified: new Date(),
        lastLogin: new Date(),
      });
    },
  },
  session: { strategy: 'jwt' },
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
            // await updateUserLogin(existingUser._id);
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
          await createStudentProfileProvider(newUser._id, profile);
          return true;
        } else if (account?.provider === 'credentials') {
          // @ts-ignore
          const existingUser = await getUserById(user._id);

          // Prevent sign-in without email verification
          if (!existingUser || !existingUser.emailVerified) {
            return false;
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error during signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token && token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.username = token.username as string;

        // If you need specific profile details, you can add them to token.profile in jwt
        // session.user.profileVerified = token.profile?.isVerified;
      }

      return session;
    },
    async jwt({ token, user, account }) {
      await dbConnect();
      if (account && account.provider === 'credentials') {
        // If the user signs in, cache data in the token
        if (user) {
          // @ts-ignore
          const userData = await getUserById(user._id);
          token.sub = userData._id;
          token.role = userData.role;
          token.username = userData.username;
        }

        // If no user, but token exists
        if (!user && token.email) {
          const existingUser = await getUserByEmail(token.email);
          if (existingUser) {
            token.sub = existingUser._id;
            token.role = existingUser.role;
            token.username = existingUser.username;
          } else {
            return null;
          }
        }
      } else if (account && account.provider === 'google') {
        // If the user signs in, cache data in the token
        if (user) {
          const userData = await getUserById(user.id);
          token.sub = userData._id;
          token.role = userData.role;
          token.username = userData.username;
        }

        // If no user, but token exists
        if (!user && token.email) {
          const existingUser = await getUserByEmail(token.email);
          if (existingUser) {
            token.sub = existingUser._id;
            token.role = existingUser.role;
            token.username = existingUser.username;
          } else {
            return null;
          }
        }
      }

      return token;
    },
  },
  //we cant remove this adapter
  adapter: MongoDBAdapter(clientPromise),
  ...authConfig,
});
