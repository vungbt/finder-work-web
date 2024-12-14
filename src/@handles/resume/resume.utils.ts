import { PaginationInput, Resume, SortOrder } from '@/configs/graphql/generated';
import useProfile from '@/hooks/redux/profile/useProfile';
import { UploadItem } from '@/libraries/common';
import { useApiClient } from '@/libraries/providers/graphql';
import { useEffect, useState } from 'react';

type ResumeUtilsResult = {
  data: Resume[];
  loading: boolean;
  isOpenUpload: boolean;
  openUpload: () => void;
  oncloseUpload: () => void;
  onSubmitResumeFile: (values: UploadItem) => void;
  setSearchValue: (value: string) => void;
  setSortActives: (value: Record<string, SortOrder>[]) => void;
  setPagination: (value: PaginationInput) => void;
};

export function ResumeUtils(): ResumeUtilsResult {
  const [data, setData] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);
  const { apiClient } = useApiClient();
  const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 30 });
  const profile = useProfile();
  useEffect(() => {
    fetchResume({ searchValue, pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination, sortActives]);
  const fetchResume = async (variables: AllResumeQueryVariables) => {
    profile;
    setLoading(true);
    const param = {
      ...variables,
      userId: profile.profile.id
    };
    const res = await apiClient.myResume(param);
    setLoading(false);
    const result = res.my_resume;
    setData(result.data as Resume[]);
  };

  const openUpload = () => {
    setIsOpenUpload(true);
  };
  const oncloseUpload = () => {
    setIsOpenUpload(false);
  };

  const onSubmitResumeFile = (values: UploadItem) => {
    console.log(values);
  };
  return {
    data,
    loading,
    isOpenUpload,
    openUpload,
    oncloseUpload,
    onSubmitResumeFile,
    setSearchValue,
    setSortActives,
    setPagination
  };
}
