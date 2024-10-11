import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { getUserByEmail, getUserById, updateUserLogin } from './services/user';
import { User } from './models/User';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import dbConnect from './lib/db/db';
// import { MongoClient } from 'mongodb';
import Account from './models/Account';
import { createStudentProfile, createStudentProfileProvider, getStudentProfileByUserId } from './services/studentProfile';
import { createAccount } from './services/account';
// import { getTeacherProfileByUserId } from './services/teacherProfile';
// import { getAdminProfileByUserId } from './services/adminProfile';
// const clientPromise = MongoClient.connect(process.env.MONGODB_URI!);
const clientPromise = dbConnect().then((mongoose) => mongoose.connection.getClient());

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/sign-in',
    error: 'auth',
  },
  events: {
    async signOut() {
      // add here
    },
    async linkAccount({ user, profile }) {
      // await dbConnect();
      await User.findByIdAndUpdate(user.id, {
        emailVerified: new Date(),
        lastLogin: new Date(),
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // await dbConnect();
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
          // await updateUserLogin(existingUser._id);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error during signIn callback:', error);
        return false; // Return false for any error
      }
    },
    // async session({ session, token }) {
    //   await dbConnect();
    //   if (token && session.user) {
    //     if (token.sub) {
    //       const user = await getUserById(token.sub);
    //       if (user) {
    //         session.user.id = user._id;
    //         session.user.role = user.role;
    //         session.user.username = user.username;
    //         // if (user.role === 'STUDENT') {
    //         //   p = await getStudentProfileByUserId(user._id);
    //         // } else if (user.role === 'TEACHER') {
    //         //   p = await getTeacherProfileByUserId(user._id);
    //         // } else if (user.role === 'ADMIN') {
    //         //   p = await getAdminProfileByUserId(user._id);
    //         // } else if (user.role === 'DEAN') {
    //         //   /**
    //         //    * @todo
    //         //    * DEAN ROLE
    //         //    */
    //         // }
    //         // const profile = JSON.parse(JSON.stringify(p));
    //         // session.user.profileVerified = profile.isVerified;
    //         // session.user.firstname = profile.firstname;
    //         // session.user.lastname = profile.lastname;
    //         // session.user.imageUrl = profile.imageUrl;
    //         // session.user.birthday = new Date(user.birthday);
    //         // if (user.birthday) {
    //         // }
    //       }
    //       // if (token.role) {
    //       //   session.user.role = token.role;
    //       // }
    //     }
    //   }
    //   return session;
    // },
    async session({ session, token }) {
      // await dbConnect();
      if (token && token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.username = token.username as string;

        // If you need specific profile details, you can add them to token.profile in jwt
        // session.user.profileVerified = token.profile?.isVerified;
        // session.user.firstname = token.profile?.firstname;
        // session.user.lastname = token.profile?.lastname;
        // session.user.imageUrl = token.profile?.imageUrl;
      }

      return session;
    },
    async jwt({ token, user }) {
      await dbConnect();

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

      return token;
    },

    // async jwt({ token, user }) {
    //   await dbConnect();
    //   // @ts-ignore
    //   if (user) token.sub = user._id;
    //   if (!user && token.email) {
    //     const existUser = await getUserByEmail(token.email);
    //     token.sub = existUser._id;
    //   }
    //   // if (account) {
    //   //   token.sub = account.id;
    //   // }
    //   if (token.sub) {
    //     const existUser = await getUserById(token.sub);
    //     if (!existUser) return token;

    //     token.role = existUser.role;
    //   }

    //   return token;
    // },
  },
  //we cant remove this adapter
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  ...authConfig,
});
