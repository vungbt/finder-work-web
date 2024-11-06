/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties, FC } from 'react';
import Add from './add';
import ArrowLeft from './arrow-left';
import ArrowRight from './arrow-right';
import BannerEmployee from './banner-employee';
import BannerEmployer from './banner-employer';
import Briefcase from './briefcase';
import Buildings from './buildings';
import CaretDownSolid from './caret-down-solid';
import CaretUpSolid from './caret-up-solid';
import CheckIcon from './check-icon';
import ChevronDown from './chevron-down';
import ChevronLeft from './chevron-left';
import ChevronRight from './chevron-right';
import ChevronUp from './chevron-up';
import Close from './close';
import CloseCircle from './close-circle';
import CloseCircleBold from './close-circle-bold';
import Danger from './danger';
import DangerSolid from './danger-solid';
import DateIcon from './date-icon';
import DocumentForward from './document-forward';
import DocumentNormal from './document-normal';
import DollarCircle from './dollar-circle';
import EditIcon from './edit-icon';
import Eye from './eye';
import EyeSlash from './eye-slash';
import Facebook from './facebook';
import Flash from './flash';
import Google from './google';
import Graph from './graph';
import Heart from './heart';
import HeartBold from './heart-bold';
import History from './history';
import Home from './home';
import HomeBold from './home-bold';
import ImageIcon from './image-icon';
import Loading from './loading';
import LoadingV2 from './loading-v2';
import Logo from './logo';
import Messages from './messages';
import Notification from './notification';
import Profile2User from './profile-2user';
import ReceiptSearch from './receipt-search';
import Search from './search';
import Setting from './setting';
import SettingBold from './setting-bold';
import SidebarLeft from './sidebar-left';
import SidebarRight from './sidebar-right';
import SMS from './sms';
import Sort from './sort';
import Star from './star';
import Success from './success';
import Trash from './trash';
import TrashSolid from './trash-solid';
import ExportIcon from './export-icon';
import ImportIcon from './import-icon';
import VoteDown from './vote-down';
import VoteUp from './vote-up';
import Bookmark from './bookmark';
import Link2 from './link-2';
import MessageText from './message-text';
import BookmarkBold from './bookmark-bold';
import VoteDownBold from './vote-down-bold';
import VoteUpBold from './vote-up-bold';
import Warning2 from './warning-2';
import Warning2Bold from './warning-2-bold';
import MessageTextBold from './message-text-bold';
import Copy from './copy';
import Frame from './frame';
import FrameBold from './frame-bold';
import AI from './ai';
import Certificate from './certificate';
import Growth from './growth';
import Social from './social';
import Rocket from './rocket';

export type IconProps = {
  className?: string;
  style?: CSSProperties;
  transform?: string;
  strokeWidth?: number;
};

export type Icon = FC<IconProps>;

const IconsDefine = {
  loading: 'loading',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  logo: 'logo',
  'banner-employer': 'banner-employer',
  'banner-employee': 'banner-employee',
  'loading-v2': 'loading-v2',
  'chevron-down': 'chevron-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  danger: 'danger',
  'eye-slash': 'eye-slash',
  eye: 'eye',
  'heart-bold': 'heart-bold',
  heart: 'heart',
  messages: 'messages',
  notification: 'notification',
  search: 'search',
  'setting-bold': 'setting-bold',
  setting: 'setting',
  sms: 'sms',
  home: 'home',
  'home-bold': 'home-bold',
  'close-circle': 'close-circle',
  'close-circle-bold': 'close-circle-bold',
  'chevron-up': 'chevron-up',
  close: 'close',
  'check-icon': 'check-icon',
  'date-icon': 'date-icon',
  google: 'google',
  facebook: 'facebook',
  success: 'success',
  briefcase: 'briefcase',
  'document-forward': 'document-forward',
  'document-normal': 'document-normal',
  'dollar-circle': 'dollar-circle',
  flash: 'flash',
  graph: 'graph',
  'profile-2user': 'profile-2user',
  'receipt-search': 'receipt-search',
  history: 'history',
  'sidebar-left': 'sidebar-left',
  'sidebar-right': 'sidebar-right',
  star: 'star',
  'image-icon': 'image-icon',
  'edit-icon': 'edit-icon',
  trash: 'trash',
  add: 'add',
  sort: 'sort',
  'danger-solid': 'danger-solid',
  'trash-solid': 'trash-solid',
  'caret-up-solid': 'caret-up-solid',
  'caret-down-solid': 'caret-down-solid',
  buildings: 'buildings',
  'export-icon': 'export-icon',
  'import-icon': 'import-icon',
  'vote-up': 'vote-up',
  'vote-down': 'vote-down',
  bookmark: 'bookmark',
  'link-2': 'link-2',
  'message-text': 'message-text',
  'bookmark-bold': 'bookmark-bold',
  'vote-up-bold': 'vote-up-bold',
  'vote-down-bold': 'vote-down-bold',
  'warning-2': 'warning-2',
  'warning-2-bold': 'warning-2-bold',
  'message-text-bold': 'message-text-bold',
  copy: 'copy',
  frame: 'frame',
  'frame-bold': 'frame-bold',
  ai: 'ai',
  rocket: 'rocket',
  certificate: 'certificate',
  social: 'social',
  growth: 'growth'
} as const;

export type IconName = keyof typeof IconsDefine;

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
  },
  briefcase: (props: IconProps) => {
    return <Briefcase {...props} />;
  },
  'document-forward': (props: IconProps) => {
    return <DocumentForward {...props} />;
  },
  'document-normal': (props: IconProps) => {
    return <DocumentNormal {...props} />;
  },
  'dollar-circle': (props: IconProps) => {
    return <DollarCircle {...props} />;
  },
  flash: (props: IconProps) => {
    return <Flash {...props} />;
  },
  graph: (props: IconProps) => {
    return <Graph {...props} />;
  },
  'profile-2user': (props: IconProps) => {
    return <Profile2User {...props} />;
  },
  'receipt-search': (props: IconProps) => {
    return <ReceiptSearch {...props} />;
  },
  history: (props: IconProps) => {
    return <History {...props} />;
  },
  'sidebar-left': (props: IconProps) => {
    return <SidebarLeft {...props} />;
  },
  'sidebar-right': (props: IconProps) => {
    return <SidebarRight {...props} />;
  },
  star: (props: IconProps) => {
    return <Star {...props} />;
  },
  'image-icon': (props: IconProps) => {
    return <ImageIcon {...props} />;
  },
  'edit-icon': (props: IconProps) => {
    return <EditIcon {...props} />;
  },
  trash: (props: IconProps) => {
    return <Trash {...props} />;
  },
  add: (props: IconProps) => {
    return <Add {...props} />;
  },
  sort: (props: IconProps) => {
    return <Sort {...props} />;
  },
  'danger-solid': (props: IconProps) => {
    return <DangerSolid {...props} />;
  },
  'trash-solid': (props: IconProps) => {
    return <TrashSolid {...props} />;
  },
  'caret-down-solid': (props: IconProps) => {
    return <CaretDownSolid {...props} />;
  },
  'caret-up-solid': (props: IconProps) => {
    return <CaretUpSolid {...props} />;
  },
  buildings: (props: IconProps) => {
    return <Buildings {...props} />;
  },
  'export-icon': (props: IconProps) => {
    return <ExportIcon {...props} />;
  },
  'import-icon': (props: IconProps) => {
    return <ImportIcon {...props} />;
  },
  'vote-down': (props: IconProps) => {
    return <VoteDown {...props} />;
  },
  'vote-up': (props: IconProps) => {
    return <VoteUp {...props} />;
  },
  bookmark: (props: IconProps) => {
    return <Bookmark {...props} />;
  },
  'link-2': (props: IconProps) => {
    return <Link2 {...props} />;
  },
  'message-text': (props: IconProps) => {
    return <MessageText {...props} />;
  },
  'bookmark-bold': (props: IconProps) => {
    return <BookmarkBold {...props} />;
  },
  'vote-down-bold': (props: IconProps) => {
    return <VoteDownBold {...props} />;
  },
  'vote-up-bold': (props: IconProps) => {
    return <VoteUpBold {...props} />;
  },
  'warning-2': (props: IconProps) => {
    return <Warning2 {...props} />;
  },
  'warning-2-bold': (props: IconProps) => {
    return <Warning2Bold {...props} />;
  },
  'message-text-bold': (props: IconProps) => {
    return <MessageTextBold {...props} />;
  },
  copy: (props: IconProps) => {
    return <Copy {...props} />;
  },
  frame: (props: IconProps) => {
    return <Frame {...props} />;
  },
  'frame-bold': (props: IconProps) => {
    return <FrameBold {...props} />;
  },
  ai: (props: IconProps) => {
    return <AI {...props} />;
  },
  certificate: (props: IconProps) => {
    return <Certificate {...props} />;
  },
  growth: (props: IconProps) => {
    return <Growth {...props} />;
  },
  social: (props: IconProps) => {
    return <Social {...props} />;
  },
  rocket: (props: IconProps) => {
    return <Rocket {...props} />;
  }
};

export const RenderIcon = ({ name, ...reset }: IconProps & { name?: IconName }) => {
  if (!name) {
    return null;
  }
  const Icon = Icons[name];
  return <Icon {...reset} />;
};

export const iconOptions = Object.keys(IconsDefine).map((key) => ({
  label: (
    <span className="flex items-center gap-2">
      {key} <RenderIcon className="max-w-5" name={key as any} />
    </span>
  ),
  value: key
}));
