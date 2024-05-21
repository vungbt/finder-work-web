import useJobCategories from '@/hooks/redux/job-category/useJobCategories';
import usePostCategories from '@/hooks/redux/post-category/usePostCategories';
import { TabItem } from '@/libraries/common';
import { GroupedOptionItem, OptionItem } from '@/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type AdminCareerActionUtilsResult = {
  tabActive: TabItem;
  tabs: TabItem[];
  jobCategories: GroupedOptionItem[];
  postCategoriesOpts: OptionItem[];
  onSubmitPost: (values: any) => void;
  setTabActive: (value: TabItem) => void;
  filterTags: (searchValue?: string) => void;
};

export function AdminCareerActionUtils({
  isEdit
}: {
  isEdit?: boolean;
}): AdminCareerActionUtilsResult {
  const t = useTranslations();
  const { options: postCategoriesOpts } = usePostCategories();
  const { options: jobCategories } = useJobCategories();
  const tabs = [
    { label: t('common.newPost'), value: 'post' },
    { label: t('common.shareALink'), value: 'link' }
  ];
  const [tabActive, setTabActive] = useState<TabItem>(tabs[0]);

  const filterTags = (searchValue?: string) => {
    console.log('searchValue===>', searchValue);
  };
  const onSubmitPost = (values: any) => {};

  return {
    tabs,
    tabActive,
    jobCategories,
    postCategoriesOpts,
    onSubmitPost,
    filterTags,
    setTabActive
  };
}
