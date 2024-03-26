import { apiClientInstance } from '@/configs/graphql';
import { UserFragment, UserRole } from '@/configs/graphql/generated';
import { NextAuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // eslint-disable-next-line no-useless-catch
        try {
          const result = await apiClientInstance.authLogin({
            email: credentials?.email ?? '',
            password: credentials?.password ?? ''
          });
          const authLoginResult = result.auth_login;
          const user: User = {
            accessToken: authLoginResult.accessToken,
            refreshToken: authLoginResult.refreshToken,
            expires: authLoginResult.expireTime,
            id: authLoginResult.profile?.id ?? '',
            profile: authLoginResult.profile as UserFragment
          };
          return user;
        } catch (error) {
          throw error;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  callbacks: {
    async signIn({ profile, account, user }) {
      if (account && profile && account.provider === 'google') {
        const tokenId = account.id_token;
        const result = await apiClientInstance.authLoginWithGoogle({ idToken: tokenId || '' });
        const data = result.auth_login_with_google;
        if (data) {
          const userInfo: User = {
            accessToken: data?.accessToken,
            refreshToken: data.refreshToken,
            expires: data.expireTime,
            id: data?.profile?.id ?? '',
            profile: data?.profile as UserFragment
          };
          user.accessToken = userInfo.accessToken;
          user.refreshToken = userInfo.refreshToken;
          user.expires = userInfo.expires;
          user.id = userInfo.id;
          user.profile = userInfo.profile;
          return true;
        }
        return false;
      }
      return true;
    },
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
        accessToken: token?.accessToken,
        expires: token?.expires,
        refreshToken: token?.refreshToken
      };
      session.expires = token?.expires;
      session.userRole = token?.profile?.role ?? UserRole.Employee;
      session.email = token?.profile?.email ?? '';
      delete session.profile;
      return session;
    }
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  pages: {
    signIn: '/auth/sign-in'
  }
};
