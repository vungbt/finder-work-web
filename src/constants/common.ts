import { UserRole } from '@/configs/graphql/generated';
import { ESettingType } from '@/types';

export const COUNTRY_CODE_DEFAULT = 'VI';
export const PAGINATION = {
  limit: 10,
  page: 1
};

export const FILE_IMAGE = {
  accepts: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
  size: 5 * 1000000 // 5MB,
};

export const FILE_VIDEO = {
  accepts: ['video/*'],
  size: 10 * 1000000 // 10MB,
};
export const FallbackImage = {
  avatarUrl:
    'https://res.cloudinary.com/dgxciqlts/image/upload/v1709873667/assets/avatar-1_r0wv7q.webp'
};

export const SettingKeys = [
  { label: 'admin', value: 'admin' },
  { label: 'employee', value: 'employee' },
  { label: 'employer', value: 'employer' },
  { label: 'landingPage', value: 'landing_page' },
  { label: 'superAdmin', value: 'super_admin' }
];

export const UserRoleOptions = [
  { label: 'admin', value: UserRole.Admin },
  { label: 'employee', value: UserRole.Employee },
  { label: 'employer', value: UserRole.Employer }
];

export const SettingTypes = [
  { label: 'menu.title', value: ESettingType.Menu },
  { label: 'header.title', value: ESettingType.Header },
  { label: 'footer.title', value: ESettingType.Footer }
];

export const RouterAction = ['add', 'edit'];
