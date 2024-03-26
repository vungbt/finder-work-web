import { UserRole } from '@/configs/graphql/generated';
import { ReactNode } from 'react';

export enum EThemeMode {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum EStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface IJWT {
  accessToken: string;
  refreshToken: string;
  expires: string;
}

export interface IUser {
  id: string;
  username: string;
  role: UserRole;
  status: EStatus;
  createdAt?: string;
  updatedAt?: string;
  deleted?: string;
}

export interface IOptItem {
  value: string;
  label: string | ReactNode;
}

export interface IGoogleUserInfo {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  picture: string;
  sub: string;
}

export interface IAuthLogin {
  email: string;
  password: string;
}
