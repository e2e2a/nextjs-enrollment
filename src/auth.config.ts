import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from './services/user';
import GoogleProvider from 'next-auth/providers/google';
const isInProductionMode = process.env.NEXT_PUBLIC_NODE_ENV === 'production';

export default {
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
      authorization: {
        params: {
          redirect_uri: `${isInProductionMode ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google` : `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`}`,
        },
      },
      // profile: async (_profile) => {
      //   console.log('_profile', _profile)
      //   return {
      //     id: _profile.sub,
      //     firstname: _profile.given_name,
      //     lastname: _profile.family_name,
      //     email: _profile.email,
      //     imageUrl: _profile.picture,
      //     createdAt: new Date()
      //   };
      // },
    }),
    Credentials({
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email as string);
        if (!user) return null;

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
