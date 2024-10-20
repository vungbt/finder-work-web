import {
  AllUserQueryVariables,
  Metadata,
  PaginationInput,
  SortOrder,
  User,
  UserOnly,
  UserStatus
} from '@/configs/graphql/generated';
import { toastSuccess } from '@/configs/toast';
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type UserManagementUtilsResult = {
  data: User[];
  metadata?: Metadata;
  loading: boolean;
  loadingChange: boolean;
  pagination: PaginationInput;
  sortActives: Record<string, SortOrder>[];
  setSearchValue: (value: string) => void;
  setPagination: (value: PaginationInput) => void;
  onSort?: (values: Record<string, SortOrder>[]) => void;
  dataUpdate?: User;
  onChangeStatus: (item: User) => void;
  onConfirmChange: () => void;
  onCloseModalConfirmChange: () => void;
};
export function AdminUserManagementUtils(): UserManagementUtilsResult {
  const { apiClient } = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChange, setLoadingChange] = useState<boolean>(false);
  const [data, setData] = useState<User[]>([]);
  const [dataUpdate, setDataUpdate] = useState<User>();
  const [metadata, setMetadata] = useState<Metadata>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 30 });

  const t = useTranslations();
  useEffect(() => {
    fetchingUser({ searchValue, pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination, dataUpdate]);

  const fetchingUser = async (variables: AllUserQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.allUser(variables);
      setLoading(false);
      const result = res.all_user;
      if (result && result.data) {
        setData(result.data as User[]);
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

  const onChangeStatus = (item: User) => {
    setDataUpdate(item);
    // console.log(dataUpdate);
  };
  const onConfirmChange = async () => {
    console.log(dataUpdate);
    try {
      if (loadingChange || !dataUpdate) return;
      setLoadingChange(true);
      const newStatus =
        dataUpdate?.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active;

      const res = await apiClient.updateUser({
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

      const result = res.update_user;

      setDataUpdate(result as User);
    } catch (error) {
      getErrorMss(error, t('noti.changeStatusError'));
    } finally {
      setDataUpdate(undefined);
      setLoadingChange(false);
      return toastSuccess(t('noti.changeStatusSuccess'));
    }
  };

  const onCloseModalConfirmChange = () => setDataUpdate(undefined);
  return {
    loading,
    data,
    metadata,
    pagination,
    sortActives,
    loadingChange,
    dataUpdate,
    setSearchValue,
    setPagination,
    onSort,
    onChangeStatus,
    onConfirmChange,
    onCloseModalConfirmChange
  };
}
