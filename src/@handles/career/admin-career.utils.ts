import {
  AllPostQueryVariables,
  Metadata,
  PaginationInput,
  Post
} from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { ActionStatus } from '@/types';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type AdminCareerUtilsResult = {
  data: Post[];
  metadata?: Metadata;
  loading: boolean;
  pagination: PaginationInput;
  setPagination: (value: PaginationInput) => void;
  setSearchValue: (value: string) => void;

  // bookmark
  onBookmark: (item: Post) => void;
};
export function AdminCareerUtils(): AdminCareerUtilsResult {
  const t = useTranslations();
  const { apiClient } = useApiClient();
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Post[]>([]);
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
        setData(result.data as Post[]);
        setMetadata(result?.metadata as Metadata);
      }
    } catch (error) {
      setLoading(false);
      getErrorMss(error, t('noti.createError'));
    }
  };

  const onBookmark = async (item: Post) => {
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

        let bookmarks: { userId: string }[] = postItem.bookmarks ?? [];
        if (bookmarkStatus === ActionStatus.Created) {
          bookmarks.push({ userId: newBookmarkPost.userId });
        } else {
          bookmarks = bookmarks.filter((bookmark) => bookmark.userId !== newBookmarkPost.userId);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        postItem.bookmarks = bookmarks as any;
        newPosts[itemIndex] = postItem;
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
