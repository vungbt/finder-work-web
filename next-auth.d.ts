import { UserFragment, UserRole } from '@/configs/graphql/generated';

export interface Token {
  accessToken: string;
  refreshToken: string;
  expires: string;
}

declare module 'next-auth/jwt' {
  interface JWT extends Token {}
}

declare module 'next-auth' {
  interface Session {
    token?: Token;
    expires: string;
    userRole?: UserRole;
    email?: string;
  }

  interface User extends Token {
    id: string;
    profile?: UserFragment;
  }
}
