import { JobTitle } from '@/configs/graphql/generated';
import { GroupedOptionItem } from '@/types';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setJobTitlesOptions } from './reducer';
import useJobTitles from './useJobTitles';

export default function useInitJobTitles() {
  const dispatch = useDispatch();
  const t = useTranslations();
  const { getJobTitles, jobTitles } = useJobTitles();

  useEffect(() => {
    getJobTitles({ pagination: { page: 1, limit: 30 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformJobTitlesOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitles]);

  const transformJobTitlesOptions = () => {
    const featured = jobTitles.filter((item) => item.isFeature);
    const defaults = jobTitles.filter((item) => !item.isFeature);

    const options: GroupedOptionItem[] = [];
    if (featured && featured.length > 0) {
      options.push({
        label: t('common.featuredTitles'),
        options: mappingToOtp(featured)
      });
    }
    if (defaults) {
      options.push({
        label: '',
        options: mappingToOtp(defaults)
      });
    }
    dispatch(setJobTitlesOptions(options));
  };

  const mappingToOtp = (items: JobTitle[]) =>
    items.map((item) => ({ label: item.name, value: item.id }));
}
