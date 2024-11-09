import {
  AllReportPostQueryVariables,
  Metadata,
  PaginationInput,
  ReportPost,
  ReportPostStatus,
  SortOrder
} from '@/configs/graphql/generated';
import { toastSuccess } from '@/configs/toast';
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type ReportPostUtilsResult = {
  data: ReportPost[];
  metadata?: Metadata;
  loading: boolean;
  pagination: PaginationInput;
  sortActives: Record<string, SortOrder>[];
  setSearchValue: (value: string) => void;
  setPagination: (value: PaginationInput) => void;
  onSort?: (values: Record<string, SortOrder>[]) => void;
  dataUpdate?: ReportPost;
  onChangeStatus: (item: ReportPost) => void;
  onConfirmChange: () => void;
  loadingChange: boolean;
  onCloseModalConfirmChange: () => void;
};
export function AdminReportPostUtils(): ReportPostUtilsResult {
  const { apiClient } = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ReportPost[]>([]);
  const [metadata, setMetadata] = useState<Metadata>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 30 });
  const [dataUpdate, setDataUpdate] = useState<ReportPost>();
  const [loadingChange, setLoadingChange] = useState<boolean>(false);
  const t = useTranslations();

  useEffect(() => {
    fetchingReportPost({ searchValue, pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination, sortActives]);

  const fetchingReportPost = async (variables: AllReportPostQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.allReportPost(variables);
      setLoading(false);
      const result = res.all_report_post;
      if (result && result.data) {
        setData(result.data as ReportPost[]);
        setMetadata(result?.metadata as Metadata);
      }
    } catch (error) {
      setLoading(false);
      getErrorMss(error, t('noti.createError'));
    }
  };

  const onSort = (values: Record<string, SortOrder>[]) => {
    setSortActives(values);
  };

  const onChangeStatus = (item: ReportPost) => {
    setDataUpdate(item);
  };
  const onConfirmChange = async () => {
    try {
      if (loadingChange || !dataUpdate) return;
      setLoadingChange(true);
      const newStatus =
        dataUpdate?.status === ReportPostStatus.Resolve
          ? ReportPostStatus.Unsolved
          : ReportPostStatus.Resolve;

      const res = await apiClient.updateReportPost({
        where: {
          id: dataUpdate?.id
        },
        data: {
          status: {
            set: newStatus
          }
        }
      });
      setLoadingChange(false);
      setPagination({ page: pagination.page, limit: 30 });
      const result = res.update_report_post;

      setDataUpdate(result as ReportPost);
    } catch (error) {
      getErrorMss(error, t('noti.changeStatusError'));
    } finally {
      setDataUpdate(undefined);
      setLoadingChange(false);
    }
    return toastSuccess(t('noti.changeStatusSuccess'));
  };

  const onCloseModalConfirmChange = () => setDataUpdate(undefined);
  return {
    data,
    metadata,
    loading,
    pagination,
    loadingChange,
    sortActives,
    dataUpdate,
    setSearchValue,
    setPagination,
    onSort,
    onChangeStatus,
    onConfirmChange,
    onCloseModalConfirmChange
  };
}
