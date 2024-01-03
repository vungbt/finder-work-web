import { ReactNode } from 'react';
import { RenderIcon } from '../icons';

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
    <div className="relative top-[-92px]">
      <RenderIcon
        name={type === 'employee' ? 'banner-employee' : 'banner-employer'}
        className="!w-full"
      />
    </div>
  );
}
