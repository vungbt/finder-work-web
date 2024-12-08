'use client';
import { City, Company } from '@/configs/graphql/generated';
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
import { CompanyFormValues } from '@/types/company';
import { Field, Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { RefObject, useMemo } from 'react';
import * as Yup from 'yup';

interface CompanyFormProps {
  onSubmit?: (values: CompanyFormValues) => void;
  data?: Company;
  isCreate?: boolean;
  formikRef: RefObject<FormikProps<CompanyFormValues>>;
  loading?: boolean;
  isDisabled?: boolean;
}

export default function CompanyForm({
  onSubmit = () => {},
  data: companyDetail,
  isCreate,
  formikRef,
  loading: loadingPostCompany,
  isDisabled
}: CompanyFormProps) {
  const t = useTranslations();
  const { optCompanySizes, optCompanyTypes, loading: loadingCompanyCommon } = useCompanyCommon();
  const {
    options: addressOptions,
    loading: addressLoading,
    getAddress,
    convertToOptions
  } = useAddress();
  const { options: jobCategories, loading: loadingJobCategories } = useJobCategories();

  const filterAddress = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getAddress({
      searchValue: searchValue,
      pagination: { limit: 30, page: 1 }
    });
    const options = convertToOptions((res?.all_address.data ?? []) as City[]);
    return options;
  };

  const validationSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: any = {
      name: Yup.string().required(t('validation.required', { label: t('name').toLowerCase() })),
      addressDetail: Yup.string().required(
        t('validation.required', { label: t('common.headquarterDetail').toLowerCase() })
      ),
      description: Yup.string().required(
        t('validation.required', { label: t('form.description').toLowerCase() })
      ),
      avatar: Yup.mixed().required(t('validation.required', { label: 'file upload' })),
      type: Yup.object().required(
        t('validation.required', { label: t('common.companyType').toLowerCase() })
      ),
      size: Yup.object().required(
        t('validation.required', { label: t('common.companySize').toLowerCase() })
      ),
      address: Yup.object().required(
        t('validation.required', { label: t('common.headquarter').toLowerCase() })
      ),
      industries: Yup.array().min(
        1,
        t('validation.required', { label: t('common.industries').toLowerCase() })
      ),
      photos: Yup.array().min(
        1,
        t('validation.required', { label: t('common.photos').toLowerCase() })
      )
    };
    return Yup.object(schema);
  }, [t]);

  const initialValues: CompanyFormValues = {
    name: companyDetail?.name || '',
    addressDetail: companyDetail?.addressDetail ?? '',
    description: companyDetail?.description ?? '',
    avatar: companyDetail?.avatar ?? null,
    type: companyDetail?.type
      ? { label: companyDetail.type.key, value: companyDetail.type.id }
      : null,
    size: companyDetail?.size
      ? { label: companyDetail.size.key, value: companyDetail.size.id }
      : null,
    photos: companyDetail?.photos ?? [],
    address: companyDetail?.address
      ? {
          label: `${companyDetail.address.name} -${companyDetail.address.countryName}`,
          value: companyDetail.address.id
        }
      : null,
    industries:
      companyDetail?.industries?.map((industry) => ({
        label: industry.name,
        value: industry.id
      })) ?? []
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
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
              disabled={isDisabled}
            />

            <Field
              label={t('name')}
              isRequired
              name="name"
              component={InputForm}
              placeholder={t('placeholder.enter', {
                label: t('name').toLowerCase()
              })}
              disabled={isDisabled}
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
              disabled={isDisabled}
            />

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
              disabled={isDisabled}
            />

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
              disabled={isDisabled}
            />

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
              disabled={isDisabled}
            />

            <Field
              label={`${t('common.headquarterDetail')}:`}
              isRequired
              name="addressDetail"
              component={TextareaForm}
              placeholder={t('placeholder.enter', {
                label: t('common.headquarterDetail').toLowerCase()
              })}
              disabled={isDisabled}
            />

            <Field
              label={t('form.description')}
              isRequired={true}
              name="description"
              placeholder={t('placeholder.shareYourThoughts')}
              component={EditorForm}
              disabled={isDisabled}
            />

            <UploadMultiple
              label={t('common.photos')}
              name="photos"
              isTouched={touched.photos !== undefined}
              values={values?.photos}
              placeholder={t('common.dropOrDragPhotos')}
              subPlaceholder={t('common.supported', { type: 'png, jpeg, jpg, webp, gif' })}
              onChange={(value) => {
                setFieldValue('photos', value);
              }}
              error={errors?.photos as string}
              setError={(mess) => setErrors(mess)}
              disabled={isDisabled}
            />

            {isCreate && (
              <Button
                className="w-fit min-w-48 !justify-center"
                styleType="info"
                type="submit"
                label={t('common.post')}
                isLoading={loadingPostCompany}
                disabled={isDisabled}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
}
