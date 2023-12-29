export enum EThemeMode {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum ERole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  EMPLOYER = 'employer'
}

export enum EStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface ILoginResult {
  jwt: IJWT;
  user: IUser;
}

export interface IJWT {
  accessToken: string;
  refreshToken: string;
  expires: string;
}

export interface IUser {
  id: string;
  username: string;
  role: ERole;
  status: EStatus;
  createdAt?: string;
  updatedAt?: string;
  deleted?: string;
}
