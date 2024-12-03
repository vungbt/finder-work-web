import useCountries from '@/hooks/redux/countries/useCountries';
import {
  BackButton,
  Button,
  DatePicker,
  InputForm,
  SelectAsync,
  SelectAsyncCreatable,
  SelectForm,
  Steps,
  TextareaForm
} from '@/libraries/common';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { CreateResume, IPersonalDetail } from '../providers/job-company.provider';
import useAddress from '@/hooks/redux/address/useAddress';
import { City, JobSalary, JobTitle } from '@/configs/graphql/generated';
import useJobCategories from '@/hooks/redux/job-category/useJobCategories';
import useJobTitles from '@/hooks/redux/job-tile/useJobTitles';
import { JobResultUtils } from '@/@handles/job/job-utils';
import { log } from 'console';

export default function CreateResumeStepOne() {
  const t = useTranslations();
  const {
    actions,
    state: { stepIndex, formData }
  } = CreateResume();

  const { defaultOption, countries } = useCountries();
  console.log(countries);

  const {
    options: addressOptions,
    loading: addressLoading,
    getAddress,
    convertToOptions
  } = useAddress();

  const { options: jobCategories, loading: loadingJobCategories } = useJobCategories();
  const { options: jobTitlesOptions, loading: loadingJobTitles, getJobTitles } = useJobTitles();
  const { jobType, jobLevel, salaryRange, currencyUnit } = JobResultUtils();

  // submit register new account
  const onHandleSubmit = async (values: IPersonalDetail) => {
    console.log(values);
    actions.nextStep(formData);
    actions.setProfileTemp(values);
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
  const initialValues = {
    jobTitle: '',
    jobType: '',
    jobExperience: '',
    salary: '',
    categories: [],
    address: ''
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
  if (formikRef.current) {
    console.log(13, formikRef.current);
  }
  useEffect(() => {
    console.log(formikRef.current);
  }, [formikRef]);

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
      {/** step active */}
      <Steps
        steps={5}
        excludeSteps={[1]}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />
      {/** form content */}
      <div>General information</div>
      <div>
        <Formik<any>
          initialValues={initialValues}
          innerRef={formikRef}
          // validationSchema={validationSchema}
          onSubmit={onHandleSubmit}
        >
          {({ values, setFieldValue }) => {
            return (
              <div className="w-full">
                <Form>
                  <Field
                    label={`${t('common.jobTitle')}:`}
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
                  <div className="flex flex-1 gap-6">
                    <Field
                      label={t('common.jobType')}
                      isRequired={true}
                      name="jobType"
                      component={SelectForm}
                      options={jobType}
                      isMulti={false}
                    />
                    <Field
                      label={t('common.deadline')}
                      isRequired={true}
                      name="deadline"
                      component={DatePicker}
                    />
                  </div>
                  <Field
                    label={t('common.level')}
                    isRequired={true}
                    name="jobExperience"
                    component={SelectForm}
                    options={jobLevel}
                    isMulti={false}
                  />
                  <div className="flex flex-1 gap-6">
                    <Field
                      label={t('common.salary')}
                      isRequired={true}
                      name="salary"
                      component={SelectForm}
                      options={salaryRange}
                      isMulti={false}
                      onChange={(value: any) => {
                        setFieldValue('salary', value);
                        console.log(value);
                      }}
                    />

                    {values.salary.value !== JobSalary.Discuss && (
                      <Field
                        label={`${t('common.currencyUnit')}:`}
                        isRequired
                        name="currencyUnit"
                        component={SelectForm}
                        options={currencyUnit}
                        placeholder={t('placeholder.select', {
                          label: t('common.categories').toLowerCase()
                        })}
                      />
                    )}
                  </div>

                  {values.salary.value === JobSalary.Begin && (
                    <Field
                      label={`${t('common.amount')}:`}
                      isRequired
                      name="fromStartRange"
                      component={InputForm}
                      placeholder={t('placeholder.select', {
                        label: t('common.categories').toLowerCase()
                      })}
                    />
                  )}

                  {values.salary.value === JobSalary.Range && (
                    <div className="flex flex-1 gap-6">
                      <Field
                        label={`${t('common.currencyUnit')}:`}
                        isRequired
                        name="fromStartRange"
                        component={InputForm}
                        placeholder={t('placeholder.select', {
                          label: t('common.categories').toLowerCase()
                        })}
                      />
                      <Field
                        label={`${t('common.fromEndRange')}:`}
                        isRequired
                        name="to"
                        component={InputForm}
                        placeholder={t('placeholder.select', {
                          label: t('common.categories').toLowerCase()
                        })}
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
                      label: t('common.headquarter').toLowerCase()
                    })}
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
