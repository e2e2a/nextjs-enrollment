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
      if (token.sub && session.user) {
        const user = await getUserById(token.sub);
        if(!user) return session
        session.user.id = user.id;
        session.user.firstname = user.firstname;
        session.user.lastname = user.lastname;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      console.log('token',token);
      console.log('session',session);

      return session;
    },
    async jwt({ token, user,account }) {
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

    
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
