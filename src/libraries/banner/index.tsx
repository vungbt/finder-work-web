import clsx from 'clsx';
import { ReactNode } from 'react';

type BannerProps = {
  type?: 'employee' | 'employer';
  title: string;
  subTitle?: string;
  summary?: string;
  actions?: ReactNode;
  tags?: string[];
};
export default function Banner({
  type = 'employee'
  // title,
  // subTitle,
  // summary,
  // actions,
  // tags
}: BannerProps) {
  return (
    <div
      className={clsx('relative top-[-92px] min-h-[572px]', {
        'bg-neon-x': type === 'employee',
        'bg-neon-y': type === 'employer'
      })}></div>
  );
}
