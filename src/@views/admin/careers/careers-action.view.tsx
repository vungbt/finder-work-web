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
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';
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
    setTabActive,
    onSubmitPost,
    filterTags,
    onChangeShareLink
  } = AdminCareerActionUtils({ isEdit });

  const validationSchema = Yup.object({
    title: Yup.string().required(
      t('validation.required', { label: t('form.title').toLowerCase() })
    ),
    shareLink: Yup.string().required(
      t('validation.required', { label: t('common.shareALink').toLowerCase() })
    ),
    categories: validationCustoms.selectMultiple(t, t('form.categories'), { max: 5, min: 1 }),
    jobCategory: validationCustoms.select(t, t('common.jobCategory')),
    content: Yup.string().required(
      t('validation.required', { label: t('form.content').toLowerCase() })
    ),
    tags: validationCustoms.selectMultiple(t, t('common.careerTags'), { max: 5, min: 1 }),
    thumbnails: validationCustoms.uploadMultiple(t, t('form.thumbnails'), { max: 5, min: 1 })
  });

  const initialValues = {
    title: '',
    shareLink: '',
    categories: [],
    jobCategory: null,
    content: '',
    tags: [],
    thumbnails: []
  };

  return (
    <div>
      <Tab options={tabs} active={tabActive} onChange={(item) => setTabActive(item)} />
      {/* form content */}
      <div className="bg-gray-200 p-6 rounded-2xl mt-5">
        <Formik
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

                <Field
                  label={t('common.shareALink')}
                  isRequired
                  name="shareLink"
                  component={InputLinkForm}
                  placeholder={t('placeholder.enter', {
                    label: t('common.shareALink').toLowerCase()
                  })}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeShareLink(e?.target?.value)
                  }
                />

                <div className="grid grid-cols-12 items-start gap-6">
                  {/* Tags */}
                  <div className="col-span-12 md:order-last md:col-span-6 xl:order-first xl:col-span-4">
                    <Field
                      label={t('common.careerTags')}
                      isRequired={true}
                      name="tags"
                      component={SelectAsyncCreatable}
                      options={[]}
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
                  isRequired={true}
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
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
