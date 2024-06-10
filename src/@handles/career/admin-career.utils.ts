import {
  AllPostQueryVariables,
  Metadata,
  PaginationInput,
  PostItem
} from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { ActionStatus } from '@/types';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type AdminCareerUtilsResult = {
  data: PostItem[];
  metadata?: Metadata;
  loading: boolean;
  pagination: PaginationInput;
  setPagination: (value: PaginationInput) => void;
  setSearchValue: (value: string) => void;

  // bookmark
  onBookmark: (item: PostItem) => void;
};
export function AdminCareerUtils(): AdminCareerUtilsResult {
  const t = useTranslations();
  const { apiClient } = useApiClient();
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PostItem[]>([]);
  const [metadata, setMetadata] = useState<Metadata>();
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 30 });

  // bookmark
  const [loadingBookmark, setLoadingBookmark] = useState<boolean>(false);

  useEffect(() => {
    fetchingPosts({ searchValue, pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination]);

  const fetchingPosts = async (variables: AllPostQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.allPost(variables);
      setLoading(false);
      const result = res.all_post;
      if (result && result.data) {
        setData(result.data as PostItem[]);
        setMetadata(result?.metadata as Metadata);
      }
    } catch (error) {
      setLoading(false);
      getErrorMss(error, t('noti.createError'));
    }
  };

  const onBookmark = async (item: PostItem) => {
    try {
      if (loadingBookmark || !item.id) return;
      setLoadingBookmark(true);
      const res = await apiClient.bookmark({ postId: item.id });
      setLoadingBookmark(false);

      const newPosts = [...data];
      const itemIndex = newPosts.findIndex((post) => post.id === item.id);
      const { bookmark_post } = res;

      if (itemIndex !== -1 && bookmark_post) {
        const postItem = newPosts[itemIndex];
        const { data: newBookmarkPost, metadata } = bookmark_post;
        const bookmarkStatus = metadata?.status;

        let userBookmark: { id: string } | null = postItem.userBookmark ?? null;
        if (bookmarkStatus === ActionStatus.Created) {
          userBookmark = { id: newBookmarkPost.userId };
        } else {
          userBookmark = null;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        postItem.userBookmark = userBookmark as any;
        newPosts[itemIndex] = postItem;
        setData(newPosts);
      }
    } catch (error) {
      setLoadingBookmark(false);
      getErrorMss(error, t('noti.createError'));
    }
  };

  return {
    loading,
    data,
    metadata,
    pagination,
    setPagination,

    setSearchValue,

    // bookmark
    onBookmark
  };
}
