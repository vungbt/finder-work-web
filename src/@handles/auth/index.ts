import localStorageHelper from '@/utils/helpers/local-storage';
import { signOut } from 'next-auth/react';

export const onSignOut = () => {
  signOut();
  localStorageHelper.clear();
};
