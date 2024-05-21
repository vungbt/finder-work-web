import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setJobCategoriesOptions } from './reducer';
import useJobCategories from './useJobCategories';
import { GroupedOptionItem } from '@/types';
import { useTranslations } from 'next-intl';
import { JobCategory } from '@/configs/graphql/generated';

export default function useInitPostCategories() {
  const dispatch = useDispatch();
  const t = useTranslations();
  const { getJobCategories, jobCategories } = useJobCategories();

  useEffect(() => {
    getJobCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformJobCategoriesOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobCategories]);

  const transformJobCategoriesOptions = () => {
    console.log('jobCategories====>', jobCategories);
    const defaults = jobCategories.filter((item) => item.isDefault);
    const top5 = jobCategories.filter((item) => item.isTheFive);
    const featured = jobCategories.filter((item) => item.isFeature);

    const options: GroupedOptionItem[] = [];
    if (defaults && defaults.length > 0) {
      options.push({
        label: t('common.jobRoleIndustry'),
        options: mappingToOtp(defaults)
      });
    }
    if (top5 && top5.length > 0) {
      options.push({
        label: t('common.theTop5Categories'),
        options: mappingToOtp(top5)
      });
    }
    if (featured && featured.length > 0) {
      options.push({
        label: t('common.featuredCategories'),
        options: mappingToOtp(featured)
      });
    }

    dispatch(setJobCategoriesOptions(options));
  };

  const mappingToOtp = (items: JobCategory[]) =>
    items.map((item) => ({ label: item.name, value: item.id }));
}
