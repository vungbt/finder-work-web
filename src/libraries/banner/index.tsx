import clsx from 'clsx';
import { ReactNode } from 'react';
import { Button } from '../common';
import { useTranslations } from 'next-intl';

type BannerProps = {
  type?: 'employee' | 'employer';
  title: string;
  subTitle?: string;
  summary?: string;
  actions?: ReactNode;
  tags?: string[];
};
export default function Banner({
  type = 'employee',
  title
  // subTitle,
  // summary,
  // actions,
  // tags
}: BannerProps) {
  return (
    <div
      className={clsx('top-[-92px] min-h-[572px] pt-[92px]', {
        'bg-neon-x': type === 'employee',
        'bg-neon-y': type === 'employer'
      })}>
      <h1
        className={clsx('mx-auto mt-8 max-w-80 text-center text-3xl font-bold text-white', {
          // "": type === 'employee',
          // "text-3xl": type === 'employer',
        })}>
        {title}
      </h1>

      {/** only show with employee */}
      {type === 'employee' && <SearchBanner />}
    </div>
  );
}

const SearchBanner = ({ className }: { className?: string }) => {
  const t = useTranslations();
  return (
    <div
      className={clsx(
        'mx-auto mt-12 flex min-h-16 max-w-[90%] items-center gap-6 rounded-4xl bg-dark p-3.5',
        className
      )}>
      <div></div>
      <Button styleType="neon" label={t('common.search')} />
    </div>
  );
};
