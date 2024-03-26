import 'server-only';
import { notFound } from 'next/navigation';
import { createTranslator } from 'next-intl';

export enum ELocale {
  EN = 'en',
  VI = 'vi'
}

export const getDictionary = async (locale: ELocale) => {
  try {
    return (await import(`../../public/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
};

export const useTranslationsServer = async (locale: ELocale) => {
  try {
    const messages = await getDictionary(locale);
    return createTranslator({ locale, messages });
  } catch (error) {
    notFound();
  }
};
