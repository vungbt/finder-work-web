import { CSSProperties, FC } from 'react';
import Loading from './loading';
import ArrowLeft from './arrow-left';
import ArrowRight from './arrow-right';
import Logo from './logo';
import BannerEmployer from './banner-employer';
import BannerEmployee from './banner-employee';
import LoadingV2 from './loading-v2';
import ChevronDown from './chevron-down';
import ChevronLeft from './chevron-left';
import ChevronRight from './chevron-right';
import Danger from './danger';
import EyeSlash from './eye-slash';
import Eye from './eye';
import HeartBold from './heart-bold';
import Heart from './heart';
import Messages from './messages';
import Notification from './notification';
import Search from './search';
import SettingBold from './setting-bold';
import Setting from './setting';
import SMS from './sms';
import Home from './home';
import HomeBold from './home-bold';
import CloseCircleBold from './close-circle-bold';
import CloseCircle from './close-circle';
import ChevronUp from './chevron-up';
import Close from './close';
import CheckIcon from './check-icon';
import DateIcon from './date-icon';
import Google from './google';
import Facebook from './facebook';
import Success from './success';

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
  | 'loading-v2'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'danger'
  | 'eye-slash'
  | 'eye'
  | 'heart-bold'
  | 'heart'
  | 'messages'
  | 'notification'
  | 'search'
  | 'setting-bold'
  | 'setting'
  | 'sms'
  | 'home'
  | 'home-bold'
  | 'close-circle'
  | 'close-circle-bold'
  | 'chevron-up'
  | 'close'
  | 'check-icon'
  | 'date-icon'
  | 'google'
  | 'facebook'
  | 'success';

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
  },
  'chevron-down': (props: IconProps) => {
    return <ChevronDown {...props} />;
  },
  'chevron-left': (props: IconProps) => {
    return <ChevronLeft {...props} />;
  },
  'chevron-right': (props: IconProps) => {
    return <ChevronRight {...props} />;
  },
  danger: (props: IconProps) => {
    return <Danger {...props} />;
  },
  'eye-slash': (props: IconProps) => {
    return <EyeSlash {...props} />;
  },
  eye: (props: IconProps) => {
    return <Eye {...props} />;
  },
  'heart-bold': (props: IconProps) => {
    return <HeartBold {...props} />;
  },
  heart: (props: IconProps) => {
    return <Heart {...props} />;
  },
  messages: (props: IconProps) => {
    return <Messages {...props} />;
  },
  notification: (props: IconProps) => {
    return <Notification {...props} />;
  },
  search: (props: IconProps) => {
    return <Search {...props} />;
  },
  'setting-bold': (props: IconProps) => {
    return <SettingBold {...props} />;
  },
  setting: (props: IconProps) => {
    return <Setting {...props} />;
  },
  sms: (props: IconProps) => {
    return <SMS {...props} />;
  },
  home: (props: IconProps) => {
    return <Home {...props} />;
  },
  'home-bold': (props: IconProps) => {
    return <HomeBold {...props} />;
  },
  'close-circle': (props: IconProps) => {
    return <CloseCircle {...props} />;
  },
  'close-circle-bold': (props: IconProps) => {
    return <CloseCircleBold {...props} />;
  },
  'chevron-up': (props: IconProps) => {
    return <ChevronUp {...props} />;
  },
  close: (props: IconProps) => {
    return <Close {...props} />;
  },
  'check-icon': (props: IconProps) => {
    return <CheckIcon {...props} />;
  },
  'date-icon': (props: IconProps) => {
    return <DateIcon {...props} />;
  },
  google: (props: IconProps) => {
    return <Google {...props} />;
  },
  facebook: (props: IconProps) => {
    return <Facebook {...props} />;
  },
  success: (props: IconProps) => {
    return <Success {...props} />;
  }
};

export const RenderIcon = ({ name, ...reset }: IconProps & { name?: IconName }) => {
  if (!name) {
    return null;
  }
  const Icon = Icons[name];
  return <Icon {...reset} />;
};
