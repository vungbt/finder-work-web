'use client';
import { EThemeMode } from '@/types';
import localStorageHelper, { EKeyStorage } from '../helpers/local-storage';

export const changeTheme = (theme: EThemeMode) => {
  if (!document) return;
  document.querySelector('html')?.setAttribute('data-theme', theme);
  localStorageHelper.set(EKeyStorage.THEME_MODE, theme);
};
