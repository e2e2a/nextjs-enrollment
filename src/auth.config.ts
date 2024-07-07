import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from './services/user';
import GoogleProvider from 'next-auth/providers/google';

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: (_profile) => {
        return {
          id: _profile.sub,
          firstname: _profile.given_name,
          lastname: _profile.family_name,
          email: _profile.email,
          image: _profile.picture,
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        // const validatedFields = SigninValidator.safeParse(credentials);
        // if (validatedFields.success) {
        //   const { email, password } = validatedFields.data;
        const user = await getUserByEmail(credentials.email as string);

        if (!user) return null;
        // if (!user.password) return null;
        // const isMatch = await comparePassword(password, user.password as string);

        // if (isMatch) return user;
        return user;
        // }
        // return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
