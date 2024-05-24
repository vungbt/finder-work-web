import { Post, User } from '@/configs/graphql/generated';
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

export const getAvatar = (user: User) => {
  const avatarUrl = user?.avatarUrl ?? user.avatar?.url;
  if (!avatarUrl) return FallbackImage.avatarUrl;
  return avatarUrl;
};

export const getFullName = (user: User) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  return fullName;
};

export const getPostMetaInfo = (item: Post) => {
  const metadata = item.metadata;
  if (!metadata || Object.keys(metadata).length <= 0) return null;
  return metadata as MetaInfo;
};
