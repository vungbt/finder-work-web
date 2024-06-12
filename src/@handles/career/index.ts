import { PostItem } from '@/configs/graphql/generated';
import { RouterPath } from '@/constants/router-path';
import { UploadItem } from '@/libraries/common';
import { MetaInfo, OptionItem } from '@/types';
import { getPostMetaInfo } from '@/utils/helpers/common';

export * from './admin-career-action.utils';
export * from './admin-career.utils';
export * from './admin-career-detail.utils';

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

export const getPostThumbnail = (item: PostItem) => {
  if (item.thumbnails && item.thumbnails.length > 0) return item.thumbnails[0];
  const metadata = getPostMetaInfo(item);
  if (metadata)
    return {
      id: metadata.title,
      url: metadata.imageUrl
    };
  return null;
};

export const getPostThumbnails = (item: PostItem) => {
  if (item.thumbnails && item.thumbnails.length > 0) return item.thumbnails;
  const metadata = getPostMetaInfo(item);
  if (metadata)
    return [
      {
        id: metadata.title,
        url: metadata.imageUrl
      }
    ];
  return [];
};

export const getShareUrl = (item: PostItem) => {
  let shareUrl = item.shareUrl;
  const metadata = getPostMetaInfo(item);
  if (!shareUrl || shareUrl.length <= 1) {
    shareUrl = metadata?.url as string;
  }
  return shareUrl ?? RouterPath?.Home;
};
