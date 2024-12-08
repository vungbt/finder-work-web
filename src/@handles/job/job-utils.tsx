import {
  Job,
  JobLevel,
  JobSalary,
  JobType,
  Metadata,
  MyJobQueryVariables,
  PaginationInput,
  SortOrder
} from '@/configs/graphql/generated';
import { toastSuccess } from '@/configs/toast';
import useProfile from '@/hooks/redux/profile/useProfile';
import { useApiClient } from '@/libraries/providers/graphql';
import { IOptItem } from '@/types';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type JobUtilsResult = {
  jobType: IOptItem[];
  jobLevel: IOptItem[];
  salaryRange: IOptItem[];
  currencyUnit: IOptItem[];
  loadingDelete: boolean;
  data: Job[];
  pagination: PaginationInput;
  setSearchValue: (value: string) => void;
  setPagination: (value: PaginationInput) => void;
  onSort: (values: Record<string, SortOrder>[]) => void;
  sortActives: Record<string, SortOrder>[];
  onDelete: (item: Job) => void;
  onConfirmDelete: () => void;
  itemDelete?: Job;
  onCloseModalConfirmDelete: () => void;
  metadata?: Metadata;
  loading: boolean;

  mapJobTypeToLabel(value: string): string;
  mapSalaryRangeToLabel(value: string): string;
  mapJobLevelToLabel(value: string): string;
};

export const JobResultUtils = (): JobUtilsResult => {
  const { apiClient } = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Job[]>([]);
  const [metadata, setMetadata] = useState<Metadata>();
  const profile = useProfile();
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 10 });
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [itemDelete, setItemDelete] = useState<Job>();
  const t = useTranslations();

  const onSort = (values: Record<string, SortOrder>[]) => {
    setSortActives(values);
  };
  const jobType: IOptItem[] = [
    {
      value: JobType.FullTime as string,
      label: 'Full-time'
    },
    {
      value: JobType.PartTime as string,
      label: 'Part-time'
    },
    {
      value: JobType.Contract as string,
      label: 'Contract'
    },
    {
      value: JobType.Internship as string,
      label: 'Internship'
    },
    {
      value: JobType.Seasonal as string,
      label: 'Seasonal'
    }
  ];

  const jobLevel: IOptItem[] = [
    {
      value: JobLevel.Director,
      label: 'Director'
    },
    {
      value: JobLevel.Entry,
      label: 'Entry Level'
    },
    {
      value: JobLevel.Junior,
      label: 'Junior'
    },
    {
      value: JobLevel.Lead,
      label: 'Lead'
    },
    {
      value: JobLevel.Senior,
      label: 'Senior'
    },
    {
      value: JobLevel.Middle,
      label: 'Mid Level'
    },
    {
      value: JobLevel.Manager,
      label: 'Manager'
    },
    {
      value: JobLevel.Vp,
      label: 'Vice President'
    }
  ];

  const salaryRange: IOptItem[] = [
    {
      value: JobSalary.Begin,
      label: 'Begin '
    },
    {
      value: JobSalary.Discuss,
      label: 'Discuss'
    },
    {
      value: JobSalary.Peak,
      label: 'Peak'
    },
    {
      value: JobSalary.Range,
      label: 'Range'
    }
  ];
  const currencyUnit: IOptItem[] = [
    {
      value: 'VND',
      label: 'VND'
    },
    {
      value: 'USD',
      label: 'USD'
    },
    {
      value: 'EUR',
      label: 'EUR'
    }
  ];
  const mapJobTypeToLabel = (value: string): string => {
    const jobTypeItem = jobType.find((item) => item.value === value);

    return (jobTypeItem?.label as string) ?? '';
  };

  const mapJobLevelToLabel = (value: string): string => {
    const jobLevelItem = jobLevel.find((item) => item.value === value);
    return (jobLevelItem?.label as string) ?? '';
  };

  const mapSalaryRangeToLabel = (value: string): string => {
    const salaryRangeItem = salaryRange.find((item) => item.value === value);
    return (salaryRangeItem?.label as string) ?? '';
  };
  useEffect(() => {
    fetchingJob({ searchValue, pagination });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination, sortActives]);

  const fetchingJob = async (variables: MyJobQueryVariables) => {
    try {
      setLoading(true);
      const param = {
        ...variables,
        userId: profile.profile.id
      };
      const res = await apiClient.myJob(param);
      setLoading(false);
      const result = res.my_job;
      if (result && result.data) {
        setData(result.data as Job[]);
        setMetadata(result?.metadata as Metadata);
      }
    } catch (error) {
      setLoading(false);
      getErrorMss(error, t('noti.createError'));
    }
  };

  const onDelete = (item: Job) => setItemDelete(item);

  const onCloseModalConfirmDelete = () => setItemDelete(undefined);

  const onConfirmDelete = async () => {
    try {
      if (loadingDelete || !itemDelete) return;
      setLoadingDelete(true);
      const res = await apiClient.deleteJob({
        where: { id: itemDelete.id }
      });
      setLoadingDelete(false);
      if (res.delete_job) {
        setItemDelete(undefined);
        setPagination({ page: pagination.page, limit: 30 });
        return toastSuccess(t('noti.deleteSuccess'));
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return {
    jobType,
    jobLevel,
    salaryRange,
    currencyUnit,
    data,
    setSearchValue,
    setPagination,
    onSort,
    sortActives,
    onDelete,
    onConfirmDelete,
    itemDelete,
    onCloseModalConfirmDelete,
    metadata,
    pagination,
    loadingDelete,
    loading,
    mapJobTypeToLabel,
    mapSalaryRangeToLabel,
    mapJobLevelToLabel
  };
};
