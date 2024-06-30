'use client';
import { Setting, UserRole } from '@/configs/graphql/generated';
import { toastSuccess } from '@/configs/toast';
import { SettingKeys, SettingTypes, UserRoleOptions } from '@/constants/common';
import { RouterPath } from '@/constants/router-path';
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useRouter } from '@/utils/navigation';
import { FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

type SettingValues = {
  key: {
    label: string;
    value: string;
  };
  type: {
    label: string;
    value: string;
  };
  showWith?: {
    label: string;
    value: string;
  }[];
  value: string;
};

type AdminGeneralDetailUtilsResult = {
  loading: boolean;
  settingDetail?: Setting;
  loadingDetail: boolean;
  form: MutableRefObject<FormikProps<SettingValues> | null>;
  onSubmitSetting: (values: SettingValues) => void;
};

export function AdminGeneralDetailUtils(): AdminGeneralDetailUtilsResult {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyParam = searchParams.get('key');
  const typeParam = searchParams.get('type');
  const form = useRef<FormikProps<SettingValues> | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [settingDetail, setSettingDetail] = useState<Setting>();
  const { apiClient } = useApiClient();

  useEffect(() => {
    if (!keyParam || keyParam.length <= 0 || !typeParam || typeParam.length <= 0) return;
    fetchDetailSetting(keyParam, typeParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyParam, typeParam]);

  const onSubmitSetting = async (values: SettingValues) => {
    try {
      setLoading(true);
      let result = null;
      const showWith = (values.showWith ?? []).map((item) => item.value) as UserRole[];
      if (keyParam && typeParam) {
        const res = await apiClient.updateSetting({
          where: { key_type: { key: keyParam, type: typeParam } },
          data: {
            key: { set: values.key.value },
            value: values.value,
            type: { set: values.type.value },
            showWith: { set: showWith }
          }
        });
        result = res.update_setting;
      } else {
        const res = await apiClient.createSetting({
          data: {
            key: values.key.value,
            value: values.value,
            type: values.type.value,
            showWith: { set: showWith }
          }
        });
        result = res.create_setting;
      }
      setLoading(false);

      if (result) {
        router.push(RouterPath.ADMIN_SETTING_GENERAL);
        return toastSuccess(t(keyParam ? 'noti.updateSuccess' : 'noti.createSuccess'));
      }
    } catch (error) {
      setLoading(false);
      getErrorMss(error, t('noti.createError'));
    }
  };

  const fetchDetailSetting = async (key: string, type: string) => {
    try {
      setLoadingDetail(true);
      const res = await apiClient.oneSetting({
        where: {
          AND: [
            {
              key: { equals: key }
            },
            { type: { equals: type } }
          ]
        }
      });
      setLoadingDetail(false);

      const result = res.one_setting;
      const formProp = form.current;

      if (result && formProp) {
        const type = SettingTypes.find((item) => item.value === result.type) ?? SettingTypes[0];
        const key = SettingKeys.find((item) => item.value === result.key) ?? SettingKeys[0];
        const showWith = (
          UserRoleOptions.filter((item) => (result.showWith ?? []).includes(item.value)) ?? []
        ).map((item) => ({
          ...item,
          label: t(item.label)
        }));

        formProp.setFieldValue('value', result.value ?? '');
        formProp.setFieldValue('type', { ...type, label: t(type.label) });
        formProp.setFieldValue('key', { ...key, label: t(key.label) });
        formProp.setFieldValue('showWith', showWith);
        setSettingDetail(result as Setting);
      }
    } catch (error) {
      setLoadingDetail(false);
    }
  };
  return {
    form,
    loading,
    settingDetail,
    loadingDetail,
    onSubmitSetting
  };
}
