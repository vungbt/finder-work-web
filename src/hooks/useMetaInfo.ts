import { MetaInfo } from '@/types';
import { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useTranslations } from 'next-intl';

export default function useMetaInfo() {
  const [loading, setLoading] = useState(false);
  const [metaInfo, setMetaInfo] = useState<MetaInfo | null>(null);
  const t = useTranslations();

  const fetchingMetaByUrl = async (url: string) => {
    const defaultShareInfo = getDefault(url);
    try {
      if (loading) return;
      const isPass = await validationLink(url);
      if (!isPass) return setMetaInfo(null);
      setLoading(true);
      const response = await axios.get<{ url: string }, { data: MetaInfo }>(
        `/api/meta-extract?url=${url}`
      );
      setLoading(false);
      const result = response.data;
      if (result && Object.keys(result).length > 0) {
        const url = result?.url ?? result?.originUrl;
        const title = result?.title ?? url;
        const desc = result?.description ?? url;

        setMetaInfo({
          ...result,
          title: title,
          description: desc,
          url: url
        });
      }
    } catch (_) {
      setLoading(false);
      setMetaInfo(defaultShareInfo);
    }
  };

  const validationLink = async (url?: string) => {
    try {
      if (!url || url.length <= 0) return false;
      const shareLinkSchema = Yup.string()
        .required(t('validation.required', { label: t('form.link').toLowerCase() }))
        .matches(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
          t('validation.valid', { label: t('form.link').toLowerCase() })
        );
      await shareLinkSchema.validate(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const getDefault = (url: string) => {
    return {
      title: url,
      description: '',
      imageUrl: undefined,
      url: url,
      originUrl: url
    };
  };

  return {
    loading,
    metaInfo,
    getDefault,
    validationLink,
    setMetaInfo,
    fetchingMetaByUrl
  };
}
