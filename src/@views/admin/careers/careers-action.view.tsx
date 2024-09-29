'use client';
import { AdminCareerActionUtils } from '@/@handles/career';
import {
  Button,
  Divider,
  EditorForm,
  InputLinkForm,
  SelectAsyncCreatable,
  SelectForm,
  Tab,
  TextareaForm,
  UploadMultiple
} from '@/libraries/common';
import { validationCustoms } from '@/utils/helpers/validation';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useMemo } from 'react';
import * as Yup from 'yup';

type CareersViewProps = {
  isEdit?: boolean;
};

export function CareersActionView({ isEdit }: CareersViewProps) {
  const t = useTranslations();
  const {
    tabActive,
    tabs,
    postCategoriesOpts,
    jobCategories,
    formikRef,
    loading,
    onSubmitPost,

    tagOptions,
    filterTags,

    // handle for tab action
    isPageNewPost,
    onHandleChangeTab,

    // meta info
    metaInfo,
    isLoadingMeta,
    onChangeShareLink
  } = AdminCareerActionUtils({ isEdit });

  const validationSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: any = {
      title: Yup.string().required(
        t('validation.required', { label: t('form.title').toLowerCase() })
      ),

      categories: validationCustoms.selectMultiple(t, t('form.categories'), { max: 5, min: 1 }),
      jobCategory: validationCustoms.select(t, t('common.jobCategory')),
      content: Yup.string().required(
        t('validation.required', { label: t('form.content').toLowerCase() })
      ),
      tags: validationCustoms.selectMultiple(t, t('common.careerTags'), { max: 5, min: 1 }),
      thumbnails: validationCustoms.uploadMultiple(t, t('form.thumbnails'), { max: 5, min: 1 })
    };
    if (!isPageNewPost) {
      schema['shareLink'] = Yup.string().required(
        t('validation.required', { label: t('common.shareALink').toLowerCase() })
      );
      delete schema.thumbnails;
    }
    return Yup.object(schema);
  }, [isPageNewPost, t]);

  const initialValues = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const init: any = {
      title: '',
      categories: [],
      jobCategory: null,
      content: '',
      tags: [],
      thumbnails: []
    };
    if (!isPageNewPost) {
      init['shareLink'] = '';
    }
    return init;
  }, [isPageNewPost]);

  return (
    <div>
      <Tab options={tabs} active={tabActive} onChange={onHandleChangeTab} />
      {/* form content */}
      <div className="bg-gray-200 p-6 rounded-2xl mt-5">
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitPost}
        >
          {({ setFieldValue, values, errors, touched, setErrors }) => {
            return (
              <Form className="flex flex-col gap-6">
                <Field
                  label={t('common.title')}
                  isRequired
                  name="title"
                  component={TextareaForm}
                  placeholder={t('placeholder.enter', {
                    label: t('common.title').toLowerCase()
                  })}
                />

                <div
                  className={clsx({
                    block: !isPageNewPost,
                    hidden: isPageNewPost
                  })}
                >
                  <Field
                    label={t('common.shareALink')}
                    isRequired
                    name="shareLink"
                    component={InputLinkForm}
                    isLoading={isLoadingMeta}
                    metaInfo={metaInfo}
                    placeholder={t('placeholder.enter', {
                      label: t('common.shareALink').toLowerCase()
                    })}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onChangeShareLink(e?.target?.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-12 items-start gap-6">
                  {/* Tags */}
                  <div className="col-span-12 md:order-last md:col-span-6 xl:order-first xl:col-span-4">
                    <Field
                      label={t('common.careerTags')}
                      isRequired={true}
                      name="tags"
                      component={SelectAsyncCreatable}
                      defaultOptions={tagOptions}
                      filterOptions={filterTags}
                      isMulti={true}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 xl:col-span-4">
                    <Field
                      label={t('common.categories')}
                      isRequired={true}
                      name="categories"
                      component={SelectForm}
                      options={postCategoriesOpts}
                      isMulti={true}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 xl:col-span-4">
                    <Field
                      label={t('common.jobCategory')}
                      isRequired={true}
                      name="jobCategory"
                      component={SelectForm}
                      options={jobCategories}
                      isMulti={false}
                    />
                  </div>
                </div>

                {/* Description */}
                <Field
                  label={t('form.content')}
                  isRequired={true}
                  name="content"
                  placeholder={t('placeholder.shareYourThoughts')}
                  component={EditorForm}
                />

                {/* Thumbnails */}
                <UploadMultiple
                  isRequired={isPageNewPost}
                  label={t('form.thumbnails')}
                  name="thumbnails"
                  isTouched={touched.thumbnails !== undefined}
                  values={values?.thumbnails}
                  placeholder={t('common.dropOrDragPhotos')}
                  subPlaceholder={t('common.supported', { type: 'png, jpeg, jpg, webp, gif' })}
                  onChange={(value) => {
                    setFieldValue('thumbnails', value);
                  }}
                  error={errors?.thumbnails as string}
                  setError={(mess) => setErrors(mess)}
                />

                <Divider />
                <Button
                  className="w-fit min-w-48 !justify-center"
                  styleType="info"
                  type="submit"
                  label={t('common.post')}
                  isLoading={loading}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
