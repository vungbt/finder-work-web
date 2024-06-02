import {
  AllPostQueryVariables,
  Metadata,
  PaginationInput,
  Post
} from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
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
};
export function AdminCareerUtils(): AdminCareerUtilsResult {
  const t = useTranslations();
  const { apiClient } = useApiClient();
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Post[]>([]);
  const [metadata, setMetadata] = useState<Metadata>();
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 30 });

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

  return {
    loading,
    data,
    metadata,
    pagination,
    setPagination,

    setSearchValue
  };
}
