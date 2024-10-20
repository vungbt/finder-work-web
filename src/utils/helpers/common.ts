import { PostItem, User, UserOnly } from '@/configs/graphql/generated';
import { toastError, toastSuccess } from '@/configs/toast';
import { COUNTRY_CODE_DEFAULT, FallbackImage } from '@/constants/common';
import { MetaInfo } from '@/types';
import chroma from 'chroma-js';
import * as ct from 'countries-and-timezones';

export const colorScaleGenerator = (color: string, number?: number) => {
  const primaryColor = chroma(color);
  return chroma.scale(['white', primaryColor]).colors(number ?? 10);
};

export const randomHexColor = () => {
  try {
    const color = chroma.random();
    return color.hex();
  } catch (error) {
    return '#7afb3d'; // Default to black in case of an error
  }
};

export const getCountryCode = () => {
  const resolvedOptions = new Intl.DateTimeFormat().resolvedOptions();
  const timezone = resolvedOptions.timeZone;
  const detailTimeZone = ct.getTimezone(timezone);
  const countries = detailTimeZone?.countries ?? [];
  if (!countries || countries.length <= 0) return COUNTRY_CODE_DEFAULT;
  return countries[0];
};

export const countCharacters = (str: string, excludeWhitespace = false) => {
  if (excludeWhitespace) {
    str = str.replace(/\s+/g, '');
  }
  return str.length;
};

export const countWords = (str: string) => {
  return str
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

export const getAvatar = (user?: User | UserOnly) => {
  if (!user) return FallbackImage.avatarUrl;
  const avatarUrl = user?.avatarUrl ?? user.avatar?.url;
  if (!avatarUrl) return FallbackImage.avatarUrl;
  return avatarUrl;
};

export const getFullName = (user?: User | UserOnly) => {
  if (!user) return 'Jobcadu';
  const fullName = `${user.firstName} ${user.lastName}`;
  return fullName;
};

export const getPostMetaInfo = (item: PostItem) => {
  const metadata = item.metadata;
  if (!metadata || Object.keys(metadata).length <= 0) return null;
  return metadata as MetaInfo;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const copyToClipboard = (text: string, mess?: { error?: string; success: string } | any) => {
  let messError = mess?.error;
  let messSuccess = mess?.success;

  if (typeof mess === 'function') {
    messError = mess('noti.copiedLinkToClipboardFailed');
    messSuccess = mess('noti.copiedLinkToClipboard');
  }
  if (!navigator || !navigator.clipboard || !text || text.length <= 0) return toastError(messError);
  navigator.clipboard.writeText(text);
  return toastSuccess(messSuccess);
};

export const focusInput = (id: string) => {
  if (!document) return;
  const inputElement = document?.getElementById(id) as HTMLInputElement;
  if (inputElement) {
    inputElement.focus();
    inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
