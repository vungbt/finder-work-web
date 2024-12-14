'use client';
import { City, ResumeType } from '@/configs/graphql/generated';
import useAddress from '@/hooks/redux/address/useAddress';
import useJobTitles from '@/hooks/redux/job-title/useJobTitles';
import {
  BackButton,
  Button,
  InputForm,
  RadioGroup,
  SelectAsync,
  SelectAsyncCreatable,
  Steps,
  TextareaForm,
  Upload
} from '@/libraries/common';
import { RegexHelper } from '@/utils/helpers/regex';
import { validationCustoms } from '@/utils/helpers/validation';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { useResume } from '../providers/resume-providers';
import { IResumePersonalDetail } from '../providers/resume-providers';

export default function PersonalDetail() {
  const t = useTranslations();
  const {
    actions,
    state: { formData, stepIndex, totalStep }
  } = useResume();
  const personalDetail = useMemo(() => formData.personal, [formData.personal]);
  const {
    options: addressOptions,
    loading: addressLoading,
    getAddress,
    convertToOptions
  } = useAddress();

  const { options: jobTitlesOptions, loading: loadingJobTitles, getJobTitles } = useJobTitles();

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    avatar: validationCustoms.upload(t, 'avatar'),
    fullName: Yup.string().required(),
    email: Yup.string()
      .required(t('validation.required', { label: t('form.email').toLowerCase() }))
      .trim()
      .email(t('validation.valid', { label: t('form.email').toLowerCase() })),
    phoneNumber: Yup.string()
      .required(t('validation.required', { label: t('form.phoneNumber').toLowerCase() }))
      .matches(RegexHelper.REGEX_PHONE, {
        message: t('validation.valid', { label: t('form.phoneNumber').toLowerCase() })
      }),
    address: validationCustoms.select(t, 'address'),
    addressDetail: Yup.string().required(
      t('validation.required', { label: t('form.firstName').toLowerCase() })
    ),
    descriptionType: Yup.string().required(t('validation.select', { label: 'summary' })),
    description: Yup.string().required(),
    jobTitle: validationCustoms.select(t, 'job title')
  });

  const initialValues: IResumePersonalDetail = {
    name: personalDetail?.name ?? '',
    avatar: personalDetail?.avatar,
    fullName: personalDetail?.fullName ?? '',
    email: personalDetail?.email ?? '',
    phoneNumber: personalDetail?.phoneNumber ?? '',
    address: personalDetail?.address,
    addressDetail: personalDetail?.addressDetail ?? '',
    descriptionType: personalDetail?.descriptionType || ResumeType.Summary,
    description: personalDetail?.description ?? '',
    jobTitle: personalDetail?.jobTitle
  };

  // submit register new account
  const onHandleSubmit = async (values: IResumePersonalDetail) => {
    try {
      console.log('values===>', values);
      actions.nextStep({ ...formData, personal: values });
    } catch (error) {
      console.log('error====>', error);
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

  const filterJobTitle = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getJobTitles({
      searchValue: searchValue,
      pagination: { limit: 30, page: 1 }
    });
    const options = (res?.all_job_title.data ?? []).map((item) => ({
      label: item.name,
      value: item.id
    }));
    return options;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      className="mx-auto pb-10 w-3/4"
    >
      <div className="mt-5">
        <Steps
          steps={totalStep}
          active={stepIndex}
          onChangeStep={(stepActive) => actions.changeStep(stepActive)}
        />
      </div>
      <div className="my-5">
        <BackButton onClick={() => actions.previousStep(formData)} />
      </div>
      <h1 className="text-3xl font-bold mt-4">Personal Detail</h1>
      {/** form content */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}
      >
        {({ setErrors, errors, setFieldValue, values }) => {
          return (
            <Form>
              <div className="flex flex-col gap-6 ">
                <div className=" border-black border rounded-2xl mt-5 justify-items-center ">
                  <div className="w-11/12 my-10">
                    <Field
                      label="Resume name"
                      isRequired
                      name="name"
                      component={InputForm}
                      placeholder={t('placeholder.enter', { label: 'name' })}
                    />
                    <Upload
                      isRequired={true}
                      label="Avatar"
                      name="avatar"
                      value={values?.avatar}
                      // placeholder="Drop or Drag a photo"
                      // subPlaceholder="Supported png, jpeg, jpg, webp, gif"
                      onChange={(value) => {
                        setFieldValue('avatar', value);
                      }}
                      error={errors?.avatar}
                      setError={(mess) => setErrors(mess)}
                    />
                    <Field
                      label="Fullname"
                      isRequired
                      name="fullName"
                      component={InputForm}
                      placeholder={t('placeholder.enter', { label: 'fullname' })}
                    />

                    <Field
                      label="Email"
                      isRequired
                      name="email"
                      component={InputForm}
                      placeholder={t('placeholder.enter', { label: 'email' })}
                    />

                    <Field
                      label="Phone Number"
                      isRequired
                      name="phoneNumber"
                      component={InputForm}
                      placeholder={t('placeholder.enter', { label: 'phoneNumber' })}
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

                    {/* job title */}
                    <Field
                      label={t('common.jobTitle')}
                      isRequired
                      name="jobTitle"
                      component={SelectAsyncCreatable}
                      loading={loadingJobTitles}
                      filterOptions={filterJobTitle}
                      defaultOptions={jobTitlesOptions}
                      placeholder={t('placeholder.select', {
                        label: t('common.jobTitle').toLowerCase()
                      })}
                    />

                    {/* is summary */}
                    <Field
                      name="descriptionType"
                      component={RadioGroup}
                      options={[
                        { label: 'Summary', value: ResumeType.Summary },
                        { label: 'Objective', value: ResumeType.Objective }
                      ]}
                    />

                    <Field
                      label="Description"
                      isRequired
                      name="description"
                      component={TextareaForm}
                      placeholder={t('placeholder.enter', {
                        label: 'description'
                      })}
                    />
                  </div>
                </div>
              </div>

              <Button
                className="mt-10"
                minWidth="full"
                type="submit"
                styleType="info"
                label={t('common.next')}
              />
            </Form>
          );
        }}
      </Formik>
    </motion.div>
  );
}
