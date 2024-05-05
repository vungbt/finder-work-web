'use client';
import {
  AllSettingPortalQueryVariables,
  PaginationInput,
  Setting,
  SortOrder
} from '@/configs/graphql/generated';
import { toastSuccess } from '@/configs/toast';
import { useApiClient } from '@/libraries/providers/graphql';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type AdminGeneralUtilsResult = {
  loading: boolean;
  data: Setting[];
  onDelete: (item: Setting) => void;
  setSearchValue: (value: string) => void;

  // delete
  loadingDelete: boolean;
  itemDelete?: Setting;
  onConfirmDelete: () => void;
  onCloseModalConfirmDelete: () => void;

  sortActives: Record<string, SortOrder>[];
  onSort?: (values: Record<string, SortOrder>[]) => void;
};

export function AdminGeneralUtils(): AdminGeneralUtilsResult {
  const t = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);
  const { apiClient } = useApiClient();
  const [data, setData] = useState<Setting[]>([]);
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 100 });
  const [searchValue, setSearchValue] = useState<string>();

  // delete
  const [itemDelete, setItemDelete] = useState<Setting>();
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  // sort action
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);

  useEffect(() => {
    fetchingSettingList({ pagination, searchValue, orderBy: sortActives });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, searchValue, sortActives]);

  const fetchingSettingList = async (variables?: AllSettingPortalQueryVariables) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await apiClient.allSettingPortal({ ...variables });
      setLoading(false);
      if (res.setting_portal) {
        setData(res.setting_portal.data as Setting[]);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onDelete = (item: Setting) => setItemDelete(item);

  const onConfirmDelete = async () => {
    try {
      if (loadingDelete || !itemDelete) return;
      setLoadingDelete(true);
      const res = await apiClient.deleteSetting({
        where: { key_type: { key: itemDelete.key, type: itemDelete.type } }
      });
      setLoadingDelete(false);
      if (res.delete_setting) {
        setItemDelete(undefined);
        setPagination({ page: 1, limit: 100 });
        return toastSuccess(t('noti.deleteSuccess'));
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onCloseModalConfirmDelete = () => setItemDelete(undefined);

  const onSort = (values: Record<string, SortOrder>[]) => {
    setSortActives(values);
  };

  return {
    loading,
    data,
    onDelete,
    setSearchValue,

    // delete
    loadingDelete,
    itemDelete,
    onConfirmDelete,
    onCloseModalConfirmDelete,

    sortActives,
    onSort
  };
}
