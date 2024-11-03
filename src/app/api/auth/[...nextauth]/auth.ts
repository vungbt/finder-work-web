import { apiClientInstance } from '@/configs/graphql';
import { UserFragment, UserRole } from '@/configs/graphql/generated';
import { NextAuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

enum EProvider {
  Google = 'google',
  Credentials = 'credentials'
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'role' }
      },
      async authorize(credentials) {
        // eslint-disable-next-line no-useless-catch
        try {
          const result = await apiClientInstance.authLogin({
            email: credentials?.email ?? '',
            password: credentials?.password ?? '',
            role: credentials?.role as UserRole
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const errResponse = error?.response;
          const errors = errResponse?.errors ?? [];
          if (!errors || errors.length <= 0) throw error;
          const message = errors[0]?.message ?? '';
          const statusCode = errors[0]?.statusCode ?? '';
          throw new Error(
            JSON.stringify({
              statusCode,
              message
            })
          );
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  callbacks: {
    async signIn({ account, user }) {
      const accountProvider = account?.provider;
      if (account) {
        switch (accountProvider) {
          case EProvider.Google: {
            const tokenId = account.id_token;
            const result = await apiClientInstance.authLoginWithGoogle({ idToken: tokenId || '' });
            const data = result.auth_login_with_google;
            if (data) {
              const userInfo: User = {
                accessToken: data?.accessToken,
                refreshToken: data.refreshToken,
                expires: data?.expireTime,
                id: data?.profile?.id ?? '',
                profile: data?.profile as UserFragment
              };
              user.accessToken = userInfo?.accessToken;
              user.refreshToken = userInfo?.refreshToken;
              user.expires = userInfo?.expires;
              user.id = userInfo?.id;
              user.profile = userInfo?.profile;
              return true;
            }
            return false;
          }
          case EProvider.Credentials: {
            if (user && account) {
              const userInfo: User = {
                accessToken: user?.accessToken,
                refreshToken: user.refreshToken,
                expires: user?.expires,
                id: user?.profile?.id ?? '',
                profile: user?.profile as UserFragment
              };
              user.accessToken = userInfo?.accessToken;
              user.refreshToken = userInfo?.refreshToken;
              user.expires = userInfo?.expires;
              user.id = userInfo?.id;
              user.profile = userInfo?.profile;
              return true;
            }
            return false;
          }
        }
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
    signIn: '/auth/sign-in',
    error: '/'
  }
};
