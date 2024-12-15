import clsx from 'clsx';
import { ReactNode } from 'react';
import SearchBanner from './search-banner';

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
  title,
  subTitle
  // summary,
  // actions,
  // tags
}: BannerProps) {
  return (
    <div
      className={clsx('top-[-92px] min-h-[572px] pt-[92px]', {
        'bg-neon-x': type === 'employee',
        'bg-neon-y': type === 'employer'
      })}
    >
      <h1
        className={clsx(
          'mx-auto mt-8 text-center text-5xl font-bold text-white leading-[5rem] font-tertiary',
          {
            // "": type === 'employee',
            // "text-3xl": type === 'employer',
          }
        )}
      >
        {title}
      </h1>
      <p className="text-5xl text-center font-bold  leading-[5rem] text-white font-tertiary">
        {subTitle}
      </p>

      {/** only show with employee */}
      {type === 'employee' && <SearchBanner />}
    </div>
  );
}
