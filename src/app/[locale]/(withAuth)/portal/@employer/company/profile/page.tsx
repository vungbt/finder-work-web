'use client';
import { City } from '@/configs/graphql/generated';
import useAddress from '@/hooks/redux/address/useAddress';
import useCompanyCommon from '@/hooks/redux/company/common/useCompanyCommon';
import useJobCategories from '@/hooks/redux/job-category/useJobCategories';
import {
  Button,
  EditorForm,
  InputForm,
  SelectAsync,
  SelectForm,
  TextareaForm,
  Upload,
  UploadMultiple
} from '@/libraries/common';
import { validationCustoms } from '@/utils/helpers/validation';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import * as Yup from 'yup';

export default function CompanyProfile() {
  const t = useTranslations();
  const { optCompanySizes, optCompanyTypes, loading: loadingCompanyCommon } = useCompanyCommon();
  const {
    options: addressOptions,
    loading: addressLoading,
    getAddress,
    convertToOptions
  } = useAddress();
  const { options: jobCategories, loading: loadingJobCategories } = useJobCategories();

  const validationSchema = Yup.object({
    avatar: validationCustoms.upload(t, t('common.avatar')),
    name: Yup.string().required(),
    industries: validationCustoms.selectMultiple(t, t('common.industries'), { min: 1, max: 3 }),
    type: validationCustoms.select(t, 'type'),
    size: validationCustoms.select(t, 'size'),
    address: validationCustoms.select(t, 'address'),
    addressDetail: Yup.string().required(
      t('validation.required', { label: t('form.firstName').toLowerCase() })
    ),
    content: Yup.string().required(),
    thumbnails: validationCustoms.uploadMultiple(t, t('form.thumbnails'), { max: 5, min: 1 })
  });
  const initialValues = {
    name: '',
    industries: [],
    type: null,
    size: null,
    address: null,
    addressDetail: '',
    content: '',
    thumbnails: [],
    avatar: null
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => {
    console.log('values====>', values);
  };

  const filterAddress = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getAddress({
      searchValue: searchValue,
      pagination: { limit: 30, page: 1 }
    });
    const options = convertToOptions((res?.all_address.data ?? []) as City[]);
    return options;
  };

  return (
    <div>
      <Formik
        // innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({ setFieldValue, values, errors, touched, setErrors }) => {
          return (
            <Form className="flex flex-col gap-6">
              <Upload
                isRequired={true}
                label="File upload"
                name="avatar"
                value={values?.avatar}
                placeholder="Drop or Drag a photo"
                subPlaceholder="Supported png, jpeg, jpg, webp, gif"
                onChange={(value) => {
                  setFieldValue('avatar', value);
                }}
                error={errors?.avatar}
                setError={(mess) => setErrors(mess)}
              />

              <Field
                label={t('common.title')}
                isRequired
                name="name"
                component={InputForm}
                placeholder={t('placeholder.enter', {
                  label: t('common.title').toLowerCase()
                })}
              />

              <Field
                label={`${t('common.industries')}:`}
                isRequired
                name="industries"
                component={SelectForm}
                loading={loadingJobCategories}
                options={jobCategories}
                isMulti={true}
                placeholder={t('placeholder.select', {
                  label: t('common.industries').toLowerCase()
                })}
              />

              {/* company type */}
              <Field
                label={`${t('common.companyType')}:`}
                isRequired
                name="type"
                component={SelectForm}
                options={optCompanyTypes}
                loading={loadingCompanyCommon}
                placeholder={t('placeholder.select', {
                  label: t('common.companyType').toLowerCase()
                })}
              />

              {/* company size */}
              <Field
                label={`${t('common.companySize')}:`}
                isRequired
                name="size"
                component={SelectForm}
                options={optCompanySizes}
                loading={loadingCompanyCommon}
                placeholder={t('placeholder.select', {
                  label: t('common.companySize').toLowerCase()
                })}
              />

              {/* address */}
              <Field
                label={`${t('common.headquarter')}:`}
                isRequired
                name="address"
                component={SelectAsync}
                loading={addressLoading}
                filterOptions={filterAddress}
                defaultOptions={addressOptions}
                placeholder={t('placeholder.select', {
                  label: t('common.headquarter').toLowerCase()
                })}
              />

              {/* address detail */}
              <Field
                label={`${t('common.headquarterDetail')}:`}
                isRequired
                name="addressDetail"
                component={TextareaForm}
                placeholder={t('placeholder.enter', {
                  label: t('common.headquarterDetail').toLowerCase()
                })}
              />
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

              {/* <Divider /> */}
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
  );
}
