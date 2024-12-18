import {
  AllJobQueryVariables,
  Job,
  Metadata,
  PaginationInput,
  SortOrder
} from '@/configs/graphql/generated';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useApiClient } from '@/libraries/providers/graphql';
import { useEffect, useState } from 'react';
import { RouterPath } from '@/constants/router-path';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type JobsUtilsResult = {
  data: Job[];
  pagination: PaginationInput;
  setSearchValue: (value: string) => void;
  setPagination: (value: PaginationInput) => void;
  onSort: (values: Record<string, SortOrder>[]) => void;
  sortActives: Record<string, SortOrder>[];
  loading: boolean;
  metadata?: Metadata;
  goToDetails: (row: Job) => void;
};

export const JobsResultUtils = (): JobsUtilsResult => {
  const { apiClient } = useApiClient();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Job[]>([]);
  const [metadata, setMetadata] = useState<Metadata>();
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 20 });
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);
  const t = useTranslations();
  const router = useRouter();

  const onSort = (values: Record<string, SortOrder>[]) => {
    setSortActives(values);
  };
  useEffect(() => {
    fetchingJob({ searchValue, pagination });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination, sortActives]);

  const fetchingJob = async (variables: AllJobQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.allJob(variables);
      setLoading(false);
      const result = res.all_job;
      if (result && result.data) {
        setData(result.data as Job[]);
        setMetadata(result?.metadata as Metadata);
      }
    } catch (error) {
      setLoading(false);
      getErrorMss(error, t('noti.createError'));
    }
  };

  const goToDetails = async (row: Job) => {
    if (!row.id) return;
    router.push(`${RouterPath.PORTAL_JOB_DETAILS}/${row.id}`);
  };

  return {
    data,
    pagination,
    setSearchValue,
    setPagination,
    onSort,
    sortActives,
    loading,
    metadata,
    goToDetails
  };
};
