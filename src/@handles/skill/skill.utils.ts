import {
  AllUserQueryVariables,
  Metadata,
  PaginationInput,
  Skill,
  SkillCreateInput,
  SkillUpdateInput,
  SortOrder
} from '@/configs/graphql/generated';
import { toastSuccess } from '@/configs/toast';
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useTranslations } from 'next-intl';
import { RefObject, useEffect, useRef, useState } from 'react';
import { FormikProps } from 'formik';
import { WorkingSkillForm } from '.';

type SkillManagementUtilsResult = {
  data: Skill[];
  metadata?: Metadata;
  loading: boolean;
  pagination: PaginationInput;
  itemDelete?: Skill;
  loadingDelete: boolean;
  isOpenAdd: boolean;
  loadingSkill: boolean;
  sortActives: Record<string, SortOrder>[];
  formikRef: RefObject<FormikProps<SkillCreateInput>>;
  dataDetails?: Skill;
  setSearchValue: (value: string) => void;
  setPagination: (value: PaginationInput) => void;
  onSort?: (values: Record<string, SortOrder>[]) => void;
  onDelete: (item: Skill) => void;
  onConfirmDelete: () => void;
  onCloseModalConfirmDelete: () => void;
  onAddWorkingSkill: () => void;
  onEdit: (item: Skill) => void;
  onCloseModalSkill: () => void;
  resetForm: () => void;
  onSubmit: (values: SkillCreateInput | SkillUpdateInput) => void;
};
export function AdminSkillManagementUtils(): SkillManagementUtilsResult {
  const { apiClient } = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Skill[]>([]);
  const [metadata, setMetadata] = useState<Metadata>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 30 });
  const [itemDelete, setItemDelete] = useState<Skill>();
  // delete
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  //skill
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [loadingSkill, setLoadingSkill] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<WorkingSkillForm>>(null);
  const [dataDetails, setDataDetail] = useState<Skill>();

  const t = useTranslations();

  useEffect(() => {
    fetchingSKill({ searchValue, pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination, sortActives]);

  const fetchingSKill = async (variables: AllUserQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.allSkill(variables);
      setLoading(false);
      const result = res.all_skill;
      if (result && result.data) {
        setData(result.data as Skill[]);
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

  const onDelete = (item: Skill) => setItemDelete(item);

  const onConfirmDelete = async () => {
    try {
      if (loadingDelete || !itemDelete) return;
      setLoadingDelete(true);
      const res = await apiClient.deleteWorkingSkill({
        where: { id: itemDelete.id }
      });
      setLoadingDelete(false);
      if (res.delete_skill) {
        setItemDelete(undefined);
        setPagination({ page: pagination.page, limit: 30 });
        return toastSuccess(t('noti.deleteSuccess'));
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onCloseModalConfirmDelete = () => setItemDelete(undefined);

  const onAddWorkingSkill = () => {
    setIsOpenAdd(true);
  };

  const onEdit = async (item: Skill) => {
    if (!item) return;
    setDataDetail(item);
    setIsOpenAdd(true);
    const form = formikRef.current;
    form?.setFieldValue('content', item.content);
  };

  const onCloseModalSkill = () => {
    setIsOpenAdd(false);
    resetForm();
    setDataDetail(undefined);
  };

  const onSubmit = async (values: SkillCreateInput | SkillUpdateInput) => {
    try {
      setLoadingSkill(true);
      let res;

      if (!dataDetails) {
        res = await apiClient.createSkill({ data: values as SkillCreateInput });
        if (res.create_skill) {
          toastSuccess(t('noti.createSkillSuccess'));
          setPagination({ page: 1, limit: 30 });
        } else {
          throw new Error('Skill creation failed');
        }
      } else {
        res = await apiClient.updateSkill({
          where: { id: dataDetails.id },
          data: {
            content: { set: values.content }
          } as SkillUpdateInput
        });
        if (res.update_skill) {
          toastSuccess(t('noti.updateSkillSuccess'));
          setPagination({ page: 1, limit: 30 });
        } else {
          throw new Error('Skill update failed');
        }
      }

      setIsOpenAdd(false);
      resetForm();
    } catch (error) {
      getErrorMss(error, t('noti.createSkillFail'));
    } finally {
      setLoadingSkill(false);
    }
  };

  const resetForm = () => {
    const form = formikRef.current;
    form?.resetForm();
  };

  return {
    data,
    metadata,
    loading,
    pagination,
    itemDelete,
    sortActives,
    loadingDelete,
    isOpenAdd,
    formikRef,
    loadingSkill,
    dataDetails,
    setSearchValue,
    setPagination,
    onSort,
    onDelete,
    onCloseModalConfirmDelete,
    onConfirmDelete,
    onAddWorkingSkill,
    onEdit,
    onCloseModalSkill,
    resetForm,
    onSubmit
  };
}
