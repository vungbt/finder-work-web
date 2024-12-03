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
import { useApiClient } from '@/libraries/providers/graphql';
import { upload } from '@/utils/upload';
import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';

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

  // const validationSchema = Yup.object({
  //   avatar: validationCustoms.upload(t, t('common.avatar')),
  //   name: Yup.string().required(),
  //   industries: validationCustoms.selectMultiple(t, t('common.industries'), { min: 1, max: 3 }),
  //   type: validationCustoms.select(t, 'type'),
  //   size: validationCustoms.select(t, 'size'),
  //   address: validationCustoms.select(t, 'address'),
  //   addressDetail: Yup.string().required(
  //     t('validation.required', { label: t('form.firstName').toLowerCase() })
  //   ),
  //   description: Yup.string().required(),
  //   photos: validationCustoms.uploadMultiple(t, t('form.thumbnails'), { max: 5, min: 1 })
  // });
  const initialValues = {
    name: '',
    slug: '',
    addressDetail: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
    avatar: null,
    type: null,
    size: null,
    photos: [],
    address: null,
    industries: []
  };
  const { apiClient } = useApiClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    console.log('Company values:', values);

    const avatar = values.avatar.file ?? null;
    console.log('Avatar:', avatar);
    const formData = upload.imgFormData(avatar);
    const res = await upload.uploadFile(avatar.name, formData);
    const avatarPath = res.data.public_id;
    const photos = values.photos ?? [];
    let photosIds: string[] = [];
    if (photos && photos.length > 0) {
      const files = photos.map((item) => item.file);
      photosIds = (await upload.uploadFiles(files)).map((item) => item.public_id);
    }
    const data: any = {
      name: values.name,
      addressDetail: values.addressDetail,
      description: values.description,
      avatarPath,
      type: {
        connect: { id: values.type.value }
      },
      size: {
        connect: { id: values.size.value }
      },
      photosIds,
      address: {
        connect: { id: Number(values.address.value) }
      },
      jobCategoriesIds: values.industries.map((industry) => industry.value)
    };
    console.log('Company data:', data);

    try {
      const response = await apiClient.createCompany({ input: data });
      console.log('Company created:', response.create_company);
    } catch (err) {
      console.error('Error creating company:', err);
    }
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
        // validationSchema={validationSchema}
        onSubmit={onSubmit}
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
                label={t('form.description')}
                isRequired={true}
                name="description"
                placeholder={t('placeholder.shareYourThoughts')}
                component={EditorForm}
              />

              {/* Thumbnails */}
              <UploadMultiple
                label={t('form.photos')}
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
