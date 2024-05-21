import { COUNTRY_CODE_DEFAULT } from '@/constants/common';
import chroma from 'chroma-js';
import * as ct from 'countries-and-timezones';

export const colorScaleGenerator = (color: string, number?: number) => {
  const primaryColor = chroma(color);
  return chroma.scale(['white', primaryColor]).colors(number ?? 10);
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
