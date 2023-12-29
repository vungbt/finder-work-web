import { ERole, ILoginResult } from '@/types/common';

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
    userRole?: ERole;
    username?: string;
  }

  interface User extends ILoginResult {
    id: string;
  }
}
