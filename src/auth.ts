import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import db from '@/lib/db';
import authConfig from '@/auth.config';
import { getUserById } from './services/user';

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: 'sign-in',
    error: 'auth',
  },
  events: {
    async linkAccount({ user, profile }) {
      // console.log('profile', profile)
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider !== 'credentials') return true;
        const existUser = await getUserById(user.id as string);
        // prevent signin without email verification
        if (!existUser || !existUser?.emailVerified) return false;
        /**
         * @Todo add 2FA check
         */
        return true;
      } catch (error) {
        return false;
      }
    },
    async session({ session, token }) {
      if (token && session.user) {
        if (token.sub) {
          const user = await getUserById(token.sub);
          if (user) {
            session.user.id = user.id;
            session.user.firstname = user.firstname;
            session.user.lastname = user.lastname;
            session.user.role = user.role;
          }
          // if (token.role) {
          //   session.user.role = token.role;
          // }
        }
      }
      console.log('session', session);
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      // if (account) {
      //   token.sub = account.id;
      // }
      if (token.sub) {
        const existUser = await getUserById(token.sub);

        console.log('tokenUser', { token });
        if (!existUser) return token;

        token.role = existUser.role;
      }

      return token;
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
