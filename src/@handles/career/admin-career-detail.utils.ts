import { OnePostQueryVariables, PostItem } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useState } from 'react';

type AdminCareerDetailUtilsResult = {
  data?: PostItem;
  loading: boolean;
};

export function AdminCareerDetailUtils(): AdminCareerDetailUtilsResult {
  const { apiClient } = useApiClient();
  const [data, setData] = useState<PostItem>();
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   if (!slug) return;
  //   fetchingDetailPost({ where: { slug: { equals: slug } } });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [slug]);

  return {
    data,
    loading
  };
}
