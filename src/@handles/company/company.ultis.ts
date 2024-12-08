'use client';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import {
  AllCompanyQueryVariables,
  Company,
  CreateCompanyInput,
  Metadata,
  OneCompanyQueryVariables,
  PaginationInput,
  SortOrder
} from '@/configs/graphql/generated';
import useProfile from '@/hooks/redux/profile/useProfile';
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { upload } from '@/utils/upload';
import { FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { IOptItem } from '@/types';
import { CompanyFormValues } from '@/types/company';
import { toastError, toastSuccess } from '@/configs/toast';

type CompanyUtilsResult = {
  data: Company[];
  metadata?: Metadata;
  isDetail: boolean;
  loadingDelete: boolean;
  loading: boolean;
  pagination: PaginationInput;
  sortActives: Record<string, SortOrder>[];
  setSearchValue: (value: string) => void;
  setPagination: (value: PaginationInput) => void;
  onSort?: (values: Record<string, SortOrder>[]) => void;
  onSubmit: (values: CompanyFormValues) => void;
  formikRef: RefObject<FormikProps<CompanyFormValues>>;
  getDetailCompany: (variables: OneCompanyQueryVariables) => void;
  setCompanyDetail: (company?: Company) => void;
  CompanyDetail?: Company;
  onDelete: (item: Company) => void;
  onConfirmDelete: () => void;
  itemDelete?: Company;
  onCloseModalConfirmDelete: () => void;
};
export function CompanyUtils(): CompanyUtilsResult {
  const { apiClient } = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Company[]>([]);
  const [CompanyDetail, setCompanyDetail] = useState<Company>();
  const [metadata, setMetadata] = useState<Metadata>();
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 10 });
  const t = useTranslations();
  const profile = useProfile();
  const formikRef = useRef<FormikProps<CompanyFormValues>>(null);
  const params = useParams();
  const id = params.id as string;
  const [itemDelete, setItemDelete] = useState<Company>();

  const isDetail = useMemo(() => !!id, [id]);
  useEffect(() => {
    fetchingCompany({ searchValue, pagination });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination, sortActives]);
  const fetchingCompany = async (variables: AllCompanyQueryVariables) => {
    try {
      setLoading(true);
      profile;
      const param = {
        ...variables,
        userId: profile.profile.id
      };
      const res = await apiClient.myCompany(param);
      setLoading(false);
      const result = res.my_company;

      if (result && result.data) {
        setData(result.data as Company[]);
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
  const onSubmit = async (values: CompanyFormValues) => {
    try {
      setLoading(true);
      const avatar = values.avatar ? values.avatar.file : null;
      let avatarPath: string | undefined;
      if (avatar) {
        console.error('Avatar is required');
        const formData = upload.imgFormData(avatar);
        const res = await upload.uploadFile(avatar.name, formData);
        avatarPath = res.data.public_id;
      }
      const photos = values.photos ?? [];
      let photosIds: string[] = [];
      if (photos && photos.length > 0) {
        const files = photos.map((item) => item.file);
        photosIds = (await upload.uploadFiles(files)).map((item) => item.public_id);
      }
      const data: CreateCompanyInput = {
        name: values.name,
        addressDetail: values.addressDetail,
        description: values.description,
        avatarPath,
        type: {
          connect: { id: values.type?.value }
        },
        size: {
          connect: { id: values.size?.value }
        },
        photosIds,
        address: {
          connect: { id: Number(values.address?.value) }
        },
        jobCategoriesIds: values.industries.map((industry: IOptItem) => industry.value),
        isDefault: false
      };
      const res = await apiClient.createCompany({ input: data });
      setLoading(false);
      console.log('Create company success', loading);
      formikRef.current?.resetForm();
      if (res.create_company) {
        toastSuccess(t('noti.createSuccess'));
      }
    } catch (error) {
      console.error('Error creating company:', error);
      setLoading(false);
      formikRef.current?.resetForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toastError((error as any)?.message);
    }
  };

  const onCloseModalConfirmDelete = () => setItemDelete(undefined);

  const getDetailCompany = async (variables: OneCompanyQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.oneCompany(variables);
      const result = res.one_company;
      setCompanyDetail(result as Company);
    } catch (error) {
      console.error('Error fetching company details:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (item: Company) => setItemDelete(item);
  const onConfirmDelete = async () => {
    try {
      if (loadingDelete || !itemDelete) return;
      setLoadingDelete(true);
      const res = await apiClient.deleteCompanyProfile({
        where: { id: itemDelete.id }
      });
      setLoadingDelete(false);
      if (res.delete_company) {
        setItemDelete(undefined);
        setPagination({ page: pagination.page, limit: 30 });
        return toastSuccess(t('noti.deleteSuccess'));
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return {
    data,
    metadata,
    loading,
    pagination,
    sortActives,
    formikRef,
    isDetail,
    loadingDelete,
    setSearchValue,
    setPagination,
    onSort,
    onSubmit,
    getDetailCompany,
    CompanyDetail,
    setCompanyDetail,
    onDelete,
    onConfirmDelete,
    itemDelete,
    onCloseModalConfirmDelete
  };
}
