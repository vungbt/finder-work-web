import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async ({ locale }) => {
  const now = headers().get('x-now');
  const timeZone = headers().get('x-time-zone') ?? 'Asia/Bangkok';
  const messages = (await import(`./public/locales/${locale}.json`)).default;

  return {
    messages,
    timeZone,
    now: now ? new Date(now) : undefined
  };
});
