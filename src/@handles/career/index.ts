import { UploadItem } from '@/libraries/common';
import { MetaInfo, OptionItem } from '@/types';

export * from './admin-career-action.utils';
export * from './admin-career.utils';

export type CareerPostForm = {
  title: string;
  categories: OptionItem[];
  jobCategory: OptionItem;
  content: string;
  tags: OptionItem[];
  thumbnails: UploadItem[];
  shareLink?: string;
  metaInfo?: MetaInfo | null;
};
