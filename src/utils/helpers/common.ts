import { COUNTRY_CODE_DEFAULT } from '@/constants/common';
import chroma from 'chroma-js';
import ct from 'countries-and-timezones';

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
