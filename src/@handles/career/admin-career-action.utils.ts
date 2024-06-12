/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreatePostInput, Tag, TagType } from '@/configs/graphql/generated';
import { toastError, toastSuccess } from '@/configs/toast';
import { RouterPath } from '@/constants/router-path';
import useJobCategories from '@/hooks/redux/job-category/useJobCategories';
import usePostCategories from '@/hooks/redux/post-category/usePostCategories';
import useTags from '@/hooks/redux/tags/useTags';
import useMetaInfo from '@/hooks/useMetaInfo';
import { TabItem } from '@/libraries/common';
import { useApiClient } from '@/libraries/providers/graphql';
import { GroupedOptionItem, MetaInfo, OptionItem } from '@/types';
import { randomHexColor } from '@/utils/helpers/common';
import { useRouter, useSearchQuery } from '@/utils/navigation';
import { upload } from '@/utils/upload';
import { FormikProps } from 'formik';
import debounce from 'lodash/debounce';
import { useTranslations } from 'next-intl';
import { RefObject, useEffect, useRef, useState } from 'react';
import { CareerPostForm } from '.';

type AdminCareerActionUtilsResult = {
  tabActive: TabItem;
  tabs: TabItem[];
  jobCategories: GroupedOptionItem[];
  postCategoriesOpts: OptionItem[];
  loading: boolean;
  formikRef: RefObject<FormikProps<CareerPostForm>>;
  onSubmitPost: (values: any) => void;

  // tags
  tagOptions: OptionItem[];
  filterTags: (searchValue?: string) => void;

  // handle for tab action
  isPageNewPost: boolean;
  onHandleChangeTab: (value: TabItem) => void;

  // meta link
  isLoadingMeta: boolean;
  metaInfo: MetaInfo | null;
  onChangeShareLink: (url: string) => void;
};

export function AdminCareerActionUtils({
  isEdit
}: {
  isEdit?: boolean;
}): AdminCareerActionUtilsResult {
  const t = useTranslations();
  const router = useRouter();
  const tabs = [
    { label: t('common.newPost'), value: 'post' },
    { label: t('common.shareALink'), value: 'link' }
  ];
  const formikRef = useRef<FormikProps<CareerPostForm>>(null);
  const { apiClient } = useApiClient();
  const { add, searchQuery } = useSearchQuery<{ slug: string }>({ slug: tabs[0].value });
  const { options: postCategoriesOpts } = usePostCategories();
  const { options: jobCategories } = useJobCategories();
  const { loading: isLoadingMeta, metaInfo, fetchingMetaByUrl, setMetaInfo } = useMetaInfo();
  const [tabActive, setTabActive] = useState<TabItem>(tabs[0]);
  const [isPageNewPost, setIsPageNewPost] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // tags handler
  const { postTagOptions, getTags } = useTags();
  useEffect(() => {
    getTags(
      {
        where: { type: { equals: TagType.Post } }
      },
      TagType.Post
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tabActive = tabs.find((item) => item.value === searchQuery?.slug);
    setIsPageNewPost(searchQuery?.slug === 'post');
    if (tabActive) return setTabActive(tabActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // handle filter tag
  const filterTags = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getTags({
      where: { type: { equals: TagType.Post } },
      searchValue: searchValue
    });
    const options = ((res.all_tag.data ?? []) as Tag[]).map((item) => ({
      label: item.name,
      value: item.id
    }));
    return options;
  };

  const onHandleChangeTab = (value: TabItem) => {
    add({ slug: value.value });
  };

  const onChangeShareLink = debounce((url: string) => {
    fetchingMetaByUrl(url);
  }, 300);

  const onSubmitPost = async (values: CareerPostForm) => {
    try {
      if (isPageNewPost) {
        delete values?.shareLink;
        delete values?.metaInfo;
      } else {
        values.metaInfo = metaInfo;
      }
      const formData = values;

      // upload thumbnails
      const thumbnails = formData.thumbnails ?? [];
      let thumbnailIds: string[] = [];
      if (thumbnails && thumbnails.length > 0) {
        const files = thumbnails.map((item) => item.file);
        thumbnailIds = (await upload.uploadFiles(files)).map((item) => item.public_id);
      }
      const categories = values.categories;
      const jobCategory = values.jobCategory;
      const tags = values.tags;

      const newTags = tags.filter((item) => item.__isNew__);
      const tagsReady = tags.filter((item) => !item.__isNew__);
      const data: CreatePostInput = {
        title: formData.title,
        content: formData.content,
        shareUrl: formData.shareLink ?? '',
        metadata: metaInfo ?? {},
        categories: {
          connect: categories.map((item) => ({ id: item.value }))
        },
        jobCategory: { connect: { id: jobCategory.value } },
        tags: {
          create: newTags.map((item) => ({
            name: item.label,
            color: randomHexColor(),
            type: TagType.Post
          })),
          connect: tagsReady.map((item) => ({ id: item.value }))
        },
        thumbnailIds
      };

      if (isEdit) {
        console.log('Edit here====>', data);
      } else {
        setLoading(true);
        const res = await apiClient.createPost({ data });
        setLoading(false);
        resetForm();
        if (res.create_post) {
          toastSuccess(t('noti.createSuccess'));
        }
      }
      router.push(RouterPath.ADMIN_CAREERS);
    } catch (error) {
      resetForm();
      setLoading(false);
      toastError((error as any)?.message);
    }
  };

  const resetForm = () => {
    const form = formikRef.current;
    form?.resetForm();
    setMetaInfo(null);
  };

  return {
    tabs,
    tabActive,
    jobCategories,
    postCategoriesOpts,
    loading,
    formikRef,
    onSubmitPost,

    tagOptions: postTagOptions,
    filterTags,

    // handle for tab action
    isPageNewPost,
    onHandleChangeTab,

    // meta info
    isLoadingMeta,
    metaInfo,
    onChangeShareLink
  };
}
