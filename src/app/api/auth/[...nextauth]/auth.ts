import { ERole } from '@/types/common';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'username' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize() {
        // eslint-disable-next-line no-useless-catch
        try {
          // const authLogin = await apiLogin({
          //   username: credentials?.username ?? '',
          //   password: credentials?.password ?? ''
          // });
          // const user = authLogin?.user;
          // if (authLogin && user) {
          //   return { ...authLogin, id: user?.id } as User;
          // }
          return null;
        } catch (error) {
          throw error;
        }
      }
    })
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      let newToken = token as JWT;
      if (!newToken.accessToken && user) {
        newToken = user;
      }
      if (
        newToken?.expires &&
        new Date(newToken.expires).getTime() <= new Date().getTime() + 60000
      ) {
        // return refreshToken({
        //   refreshToken: String(newToken?.refreshToken || '')
        // }).then((result) => {
        //   if (result.error) {
        //     return signOut();
        //   }
        //   return { ...newToken, ...result };
        // });
      }
      return newToken;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      session.token = {
        accessToken: token?.jwt?.accessToken,
        expires: token?.jwt?.expires,
        refreshToken: token?.jwt?.refreshToken
      };
      session.expires = token?.jwt?.expires;
      session.userRole = token?.user?.role ?? ERole.EMPLOYEE;
      session.username = token?.user?.username ?? '';
      delete session.user;
      return session;
    }
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  pages: {
    signIn: '/auth/login'
  }
};
