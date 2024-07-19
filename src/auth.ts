import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { getUserByEmail, getUserById } from './services/user';
import Users from './models/Users';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import dbConnect from './lib/db/db';
import { MongoClient } from 'mongodb';
import Accounts from './models/Accounts';
const clientPromise = MongoClient.connect(process.env.MONGODB_URI!);

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: 'sign-in',
    error: 'auth',
  },
  events: {
    async linkAccount({ user, profile }) {
      await dbConnect();
      await Users.findByIdAndUpdate(user.id, {
        emailVerified: new Date(),
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
            const existAccount = await Accounts.findOne({ userId: existingUser._id });
            if (!existAccount) {
              const newAccount = new Accounts({
                provider: account?.provider,
                type: account?.type,
                providerAccountId: account?.providerAccountId,
                access_token: account?.access_token,
                expires_at: account?.expires_at,
                scope: account?.scope,
                token_type: account?.token_type,
                id_token: account?.id_token,
                userId: existingUser._id,
              });

              await newAccount.save();
            }
            return true;
            // return false;
          }
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
            session.user.role = user.role;
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
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  ...authConfig,
});
