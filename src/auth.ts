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

    async jwt({ token, user }) {
      if (!token.sub) {
        console.log({user})
        return token
      }

      const existUser = await getUserById(token.sub);

      if (!existUser) return token;
      console.log('tokenUser', {token});

      token.role = existUser.role;
      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      console.log('token',token);

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
