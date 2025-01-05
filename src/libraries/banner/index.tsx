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
      className={clsx('top-[-92px] min-h-[572px] pt-[92px] pb-8', {
        'bg-neon-x': type === 'employee',
        'bg-neon-y': type === 'employer'
      })}
    >
      <h1
        className={clsx(
          'mx-auto mt-8 text-center text-6xl font-bold text-white leading-[5rem] font-tertiary',
          {
            // "": type === 'employee',
            // "text-3xl": type === 'employer',
          }
        )}
      >
        {title}
      </h1>
      <p className="text-6xl text-center font-bold  leading-[5rem] text-white font-tertiary">
        {subTitle}
      </p>

      {/** only show with employee */}
      <div className="container">{type === 'employee' && <SearchBanner />}</div>

      <div className="container h-[290px] grid grid-cols-12 gap-3 mt-5">
        <div className="w-auto rounded-2xl bg-white col-span-4">Menu</div>
        <div className="rounded-2xl bg-white col-span-8">Content</div>
      </div>
    </div>
  );
}
