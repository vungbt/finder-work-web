'use client';
import { AdminCareerActionUtils } from '@/@handles/career';
import {
  Button,
  EditorForm,
  SelectAsyncCreatable,
  SelectForm,
  Tab,
  TextareaForm,
  UploadMultiple
} from '@/libraries/common';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
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
    filterTags
  } = AdminCareerActionUtils({ isEdit });

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    categories: Yup.array()
      .of(Yup.string().required('Please select an option'))
      .min(1, 'Please select at least one option'),
    jobTitle: Yup.string().required('Title is required'),
    content: Yup.string().required('Title is required'),
    tags: Yup.array()
      .of(Yup.string().required('Please select an option'))
      .min(1, 'Please select at least one option'),
    thumbnails: Yup.array()
      .min(1, 'Thumbnails must be required')
      .of(
        Yup.object()
          .shape({
            id: Yup.string().required('Thumbnail required'),
            url: Yup.string().required('Thumbnail required')
          })
          .nullable()
      )
  });

  const initialValues = {
    title: '',
    categories: [],
    jobTitle: '',
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
          {({ setFieldValue, values, errors, setErrors }) => {
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

                <div className="flex items-start gap-6">
                  <Field
                    label={t('common.categories')}
                    isRequired={true}
                    name="categories"
                    component={SelectForm}
                    options={postCategoriesOpts}
                    isMulti={true}
                  />

                  <Field
                    label={t('common.jobCategory')}
                    isRequired={true}
                    name="jobCategory"
                    component={SelectForm}
                    options={jobCategories}
                    isMulti={false}
                  />
                </div>

                {/* Description */}
                <Field
                  label={t('form.content')}
                  isRequired={true}
                  name="content"
                  placeholder={t('placeholder.shareYourThoughts')}
                  component={EditorForm}
                />

                {/* Tags */}
                <Field
                  label={t('common.careerTags')}
                  isRequired={true}
                  name="tags"
                  component={SelectAsyncCreatable}
                  options={[]}
                  filterOptions={filterTags}
                  isMulti={true}
                />

                {/* Thumbnails */}
                <UploadMultiple
                  isRequired={true}
                  label={t('form.thumbnails')}
                  name="thumbnails"
                  values={values?.thumbnails}
                  placeholder={t('common.dropOrDragPhotos')}
                  subPlaceholder={t('common.supported', { type: 'png, jpeg, jpg, webp, gif' })}
                  onChange={(value) => {
                    setFieldValue('thumbnails', value);
                  }}
                  error={errors?.thumbnails as string}
                  setError={(mess) => setErrors(mess)}
                />

                <Button className="w-fit" styleType="info" type="submit" label={t('common.post')} />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
