import { JobResultUtils } from '@/@handles/job/job-utils';
import { City, JobSalary, JobTitle } from '@/configs/graphql/generated';
import useAddress from '@/hooks/redux/address/useAddress';

import {
  BackButton,
  Button,
  DatePicker,
  InputForm,
  SelectAsync,
  SelectAsyncCreatable,
  SelectForm,
  Steps
} from '@/libraries/common';

import { useMemo } from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { IJobInformation, useJob } from '../providers';
import { AdminCareerActionUtils } from '@/@handles/career';
import useJobTitles from '@/hooks/redux/job-title/useJobTitles';

export default function CreateResumeStepOne() {
  const t = useTranslations();
  const {
    actions,
    state: { formData, stepIndex }
  } = useJob();

  const {
    options: addressOptions,
    loading: addressLoading,
    getAddress,
    convertToOptions
  } = useAddress();
  const { jobCategories } = AdminCareerActionUtils({ isEdit: false });

  const { options: jobTitlesOptions, loading: loadingJobTitles, getJobTitles } = useJobTitles();
  const { jobType, jobLevel, salaryRange, currencyUnit } = JobResultUtils();

  const validationSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: any = {
      jobTitleOpt: Yup.object().required(
        t('validation.required', { label: t('common.jobTitle').toLowerCase() })
      ),
      jobCategory: Yup.object().required(
        t('validation.required', { label: t('common.jobCategory').toLowerCase() })
      ),

      type: Yup.object().required(
        t('validation.required', { label: t('common.jobType').toLowerCase() })
      ),
      applicationDeadline: Yup.string().required(
        t('validation.required', { label: t('common.deadline').toLowerCase() })
      ),
      level: Yup.object().required(
        t('validation.required', { label: t('common.jobLevel').toLowerCase() })
      ),
      salary: Yup.object().required(
        t('validation.required', { label: t('common.salary').toLowerCase() })
      ),
      address: Yup.object().required(
        t('validation.required', { label: t('common.address').toLowerCase() })
      ),
      addressDetail: Yup.string().required(
        t('validation.required', { label: t('common.addressDetail').toLowerCase() })
      )
    };
    return Yup.object(schema);
  }, [t]);

  const onHandleSubmit = async (values: IJobInformation) => {
    actions.nextStep({ ...formData, jobInformation: values });
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
  const initialValues: IJobInformation = {
    jobTitleOpt: formData.jobInformation?.jobTitleOpt ?? undefined,
    type: formData.jobInformation?.type ?? undefined,
    applicationDeadline: formData.jobInformation?.applicationDeadline ?? '',
    level: formData.jobInformation?.level ?? undefined,
    salary: formData.jobInformation?.salary ?? undefined,
    currencyUnit: formData.jobInformation?.currencyUnit ?? undefined,
    fromStartRange: formData.jobInformation?.fromStartRange ?? '',
    toEndRange: formData.jobInformation?.toEndRange ?? '',
    address: formData.jobInformation?.address ?? undefined,
    jobCategory: formData.jobInformation?.jobCategory ?? undefined,
    addressDetail: formData.jobInformation?.addressDetail ?? ''
  };

  const filterJobTitle = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getJobTitles({
      searchValue: searchValue,
      pagination: { limit: 30, page: 1 }
    });
    const options = ((res?.all_job_title.data ?? []) as JobTitle[]).map((item) => ({
      label: item.name,
      value: item.id
    }));
    return options;
  };

  const formikRef = useRef(null);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      className="w-3/4 ms-6"
    >
      <Steps
        steps={5}
        excludeSteps={[1]}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />
      {/** form content */}
      <div>
        <Formik<IJobInformation>
          initialValues={initialValues}
          innerRef={formikRef}
          validationSchema={validationSchema}
          onSubmit={onHandleSubmit}
        >
          {({ values, setFieldValue }) => {
            return (
              <div className="w-full">
                <Form>
                  <Field
                    label={t('common.jobTitle')}
                    isRequired
                    name="jobTitleOpt"
                    component={SelectAsyncCreatable}
                    loading={loadingJobTitles}
                    filterOptions={filterJobTitle}
                    defaultOptions={jobTitlesOptions}
                    placeholder={t('placeholder.select', {
                      label: t('common.jobTitle').toLowerCase()
                    })}
                  />
                  <div className="flex flex-1 gap-6">
                    <Field
                      label={t('common.jobType')}
                      isRequired={true}
                      name="type"
                      component={SelectForm}
                      options={jobType}
                      isMulti={false}
                      placeholder={t('placeholder.select', {
                        label: t('common.jobType').toLowerCase()
                      })}
                    />
                    <Field
                      label={t('common.deadline')}
                      isRequired={true}
                      name="applicationDeadline"
                      component={DatePicker}
                      placeholder={t('placeholder.select', {
                        label: t('common.deadline').toLowerCase()
                      })}
                    />
                  </div>
                  <Field
                    label={t('common.level')}
                    isRequired={true}
                    name="level"
                    component={SelectForm}
                    options={jobLevel}
                    isMulti={false}
                    placeholder={t('placeholder.select', {
                      label: t('common.level').toLowerCase()
                    })}
                  />
                  <Field
                    label={t('common.jobCategory')}
                    isRequired={true}
                    name="jobCategory"
                    component={SelectForm}
                    options={jobCategories}
                    isMulti={false}
                    placeholder={t('placeholder.select', {
                      label: t('common.jobCategory').toLowerCase()
                    })}
                  />
                  <div className="flex flex-1 gap-6">
                    <Field
                      label={t('common.salary')}
                      isRequired={true}
                      name="salary"
                      component={SelectForm}
                      options={salaryRange}
                      isMulti={false}
                      onChange={(value: string) => {
                        setFieldValue('salary', value);
                      }}
                      placeholder={t('placeholder.select', {
                        label: t('common.salary').toLowerCase()
                      })}
                    />

                    {values.salary?.value !== JobSalary.Discuss && (
                      <Field
                        label={`${t('common.currencyUnit')}:`}
                        isRequired
                        name="currencyUnit"
                        component={SelectForm}
                        options={currencyUnit}
                        placeholder={t('placeholder.select', {
                          label: t('common.currencyUnit').toLowerCase()
                        })}
                      />
                    )}
                  </div>

                  {values.salary?.value === JobSalary.Begin && (
                    <Field
                      label={`${t('common.fromStartRange')}:`}
                      isRequired
                      name="fromStartRange"
                      component={InputForm}
                      placeholder={t('placeholder.select', {
                        label: t('common.fromStartRange').toLowerCase()
                      })}
                    />
                  )}

                  {values.salary?.value === JobSalary.Peak && (
                    <Field
                      label={`${t('common.toEndRange')}:`}
                      isRequired
                      name="toEndRange"
                      component={InputForm}
                      placeholder={t('common.toEndRange')}
                    />
                  )}

                  {values.salary?.value === JobSalary.Range && (
                    <div className="flex flex-1 gap-6">
                      <Field
                        label={`${t('common.fromStartRange')}:`}
                        isRequired
                        name="fromStartRange"
                        component={InputForm}
                        placeholder={t('common.fromStartRange')}
                      />
                      <Field
                        label={`${t('common.toEndRange')}:`}
                        isRequired
                        name="toEndRange"
                        component={InputForm}
                        placeholder={t('common.toEndRange')}
                      />
                    </div>
                  )}
                  <Field
                    label={`${t('common.address')}:`}
                    isRequired
                    name="address"
                    component={SelectAsync}
                    loading={addressLoading}
                    filterOptions={filterAddress}
                    defaultOptions={addressOptions}
                    placeholder={t('placeholder.select', {
                      label: t('common.address').toLowerCase()
                    })}
                  />
                  <Field
                    label={`${t('common.addressDetail')}:`}
                    isRequired
                    name="addressDetail"
                    component={InputForm}
                    placeholder={t('common.addressDetail')}
                  />
                  <div className="flex flex-1 justify-between my-10">
                    <BackButton onClick={() => actions.previousStep(formData)} />
                    <Button
                      className="w-fit min-w-48 !justify-center"
                      type="submit"
                      styleType="info"
                      label={t('common.next')}
                    />
                  </div>
                </Form>
              </div>
            );
          }}
        </Formik>
      </div>
    </motion.div>
  );
}
