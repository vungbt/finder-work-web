import { CSSProperties, FC } from 'react';
import Loading from './loading';
import ArrowLeft from './arrow-left';
import ArrowRight from './arrow-right';
import Logo from './logo';
import BannerEmployer from './banner-employer';
import BannerEmployee from './banner-employee';
import LoadingV2 from './loading-v2';

export type IconProps = {
  className?: string;
  style?: CSSProperties;
  transform?: string;
  strokeWidth?: number;
};

export type Icon = FC<IconProps>;

export type IconName =
  | 'loading'
  | 'arrow-left'
  | 'arrow-right'
  | 'logo'
  | 'banner-employer'
  | 'banner-employee'
  | 'loading-v2';

export type IconsType = Record<IconName, Icon>;

export const Icons: IconsType = {
  loading: (props: IconProps) => {
    return <Loading {...props} />;
  },
  'loading-v2': (props: IconProps) => {
    return <LoadingV2 {...props} />;
  },
  'arrow-left': (props: IconProps) => {
    return <ArrowLeft {...props} />;
  },
  'arrow-right': (props: IconProps) => {
    return <ArrowRight {...props} />;
  },
  logo: (props: IconProps) => {
    return <Logo {...props} />;
  },
  'banner-employer': (props: IconProps) => {
    return <BannerEmployer {...props} />;
  },
  'banner-employee': (props: IconProps) => {
    return <BannerEmployee {...props} />;
  }
};

export const RenderIcon = ({ name, ...reset }: IconProps & { name?: IconName }) => {
  if (!name) {
    return null;
  }
  const Icon = Icons[name];
  return <Icon {...reset} />;
};
