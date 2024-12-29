'use client';
import { City, Company } from '@/configs/graphql/generated';
import useAddress from '@/hooks/redux/address/useAddress';
import useCompanies from '@/hooks/redux/company/list/useCompanies';
import {
  BackButton,
  Button,
  CheckboxGroup,
  Collapse,
  DatePicker,
  SelectAsync,
  SelectAsyncCreatable,
  Steps,
  TextareaForm
} from '@/libraries/common';
import { validationCustoms } from '@/utils/helpers/validation';
import { Field, FieldArray, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { IResumeWorkExperience, useResume } from '../providers/resume-providers';
import useJobTitles from '@/hooks/redux/job-title/useJobTitles';

export default function WorkExperience() {
  const t = useTranslations();
  const {
    actions,
    state: { formData, stepIndex, totalStep }
  } = useResume();
  const workExperiences = useMemo(
    () => formData?.workExperiences ?? [],
    [formData.workExperiences]
  );
  const {
    options: addressOptions,
    loading: addressLoading,
    getAddress,
    convertToOptions
  } = useAddress();

  const { options: jobTitlesOptions, loading: loadingJobTitles, getJobTitles } = useJobTitles();
  const { options: companies, loading: companyLoading, getCompanies } = useCompanies();

  const validationSchema = Yup.object({
    workExperiences: Yup.array().of(
      Yup.object({
        jobTitle: validationCustoms.select(t, 'job title'),
        company: validationCustoms.select(t, 'company'),
        address: validationCustoms.select(t, 'address'),
        description: Yup.string().required(t('validation.required', { label: t('description') })),
        isCurrentlyWorkHere: Yup.array().of(
          Yup.string().required(t('validation.required', { label: t('form.policy') }))
        ),
        isFreelancer: Yup.array().of(
          Yup.string().required(t('validation.required', { label: t('form.policy') }))
        ),
        startAt: Yup.date().required('Start date required'),
        endAt: Yup.date().when('isCurrentlyWorkHere', (isCurrentlyWorkHere, schema) => {
          if (
            isCurrentlyWorkHere &&
            isCurrentlyWorkHere.length > 0 &&
            isCurrentlyWorkHere[0].length > 0
          ) {
            return schema.nullable(); // Allow null if the user currently works there
          }
          return schema
            .required(t('validation.required', { label: 'end date' }))
            .min(Yup.ref('startAt'), 'End date must be > start date'); // Ensure endAt > startAt
        })
      })
    )
  });

  const defaultFormValue: IResumeWorkExperience = {
    jobTitle: undefined,
    company: null,
    isFreelancer: [],
    address: null,
    startAt: null,
    endAt: null,
    description: '',
    isCurrentlyWorkHere: []
  };

  const initialValues: { workExperiences: IResumeWorkExperience[] } = {
    workExperiences: workExperiences.map((item) => ({
      jobTitle: item?.jobTitle,
      company: item?.company,
      isFreelancer: item?.isFreelancer ?? [],
      address: item?.address,
      startAt: item?.startAt,
      endAt: item?.endAt || null,
      description: item?.description,
      isCurrentlyWorkHere: item?.isCurrentlyWorkHere ?? []
    }))
  };

  // submit register new account
  const onHandleSubmit = async (values: { workExperiences: IResumeWorkExperience[] }) => {
    console.log('values===>', values);
    try {
      actions.nextStep({ ...formData, workExperiences: values.workExperiences ?? [] });
    } catch (error) {
      console.log('error====>', error);
    }
  };

  const filterCompanies = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getCompanies({
      searchValue: searchValue,
      pagination: { limit: 20, page: 1 }
    });
    const options = ((res?.all_company.data ?? []) as Company[]).map((item) => ({
      label: item.name,
      value: item.id
    }));
    return options;
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
      <h1 className="text-3xl font-bold mt-4">Work Experience</h1>

      {/** form content */}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}
      >
        {({ values }) => {
          return (
            <Form>
              <FieldArray name="workExperiences">
                {({ remove, push }) => (
                  <div>
                    {(values.workExperiences ?? []).map((_, index) => (
                      <div key={index} className="border-black border rounded-2xl mt-5">
                        <Collapse remove={remove} index={index} header={'Company'}>
                          <div className="flex flex-col gap-6">
                            {/* job title */}
                            <Field
                              label={t('common.jobTitle')}
                              isRequired
                              name={`workExperiences[${index}].jobTitle`}
                              component={SelectAsyncCreatable}
                              loading={loadingJobTitles}
                              filterOptions={filterJobTitle}
                              defaultOptions={jobTitlesOptions}
                              placeholder={t('placeholder.select', {
                                label: t('common.jobTitle').toLowerCase()
                              })}
                            />

                            {/* company */}
                            <Field
                              label={`${t('company')}:`}
                              isRequired
                              name={`workExperiences[${index}].company`}
                              component={SelectAsyncCreatable}
                              defaultOptions={companies}
                              loading={companyLoading}
                              filterOptions={filterCompanies}
                              placeholder={t('placeholder.selectOrCreate', {
                                label: t('company').toLowerCase()
                              })}
                            />

                            {/* address */}
                            <Field
                              label={`${t('common.headquarter')}:`}
                              isRequired
                              name={`workExperiences[${index}].address`}
                              component={SelectAsync}
                              loading={addressLoading}
                              filterOptions={filterAddress}
                              defaultOptions={addressOptions}
                              placeholder={t('placeholder.select', {
                                label: t('common.headquarter').toLowerCase()
                              })}
                            />

                            <div className="flex flex-1 gap-6 mt-5">
                              <Field
                                isRequired
                                name={`workExperiences[${index}].startAt`}
                                label="Start date"
                                component={DatePicker}
                                isClearable
                                type="date"
                                placeholder={t('form.startDate')}
                              />
                              <Field
                                isRequired
                                name={`workExperiences[${index}].endAt`}
                                label="End date"
                                component={DatePicker}
                                isClearable
                                type="date"
                                placeholder={t('form.endDate')}
                              />
                            </div>

                            {/* current work here */}
                            <div className="flex flex-1 gap-6">
                              <Field
                                name={`workExperiences[${index}].isCurrentlyWorkHere`}
                                component={CheckboxGroup}
                                options={[
                                  {
                                    value: 'isCurrentlyWorkHere',
                                    label: 'I currently work here'
                                  }
                                ]}
                                layout="vertical"
                                size="middle"
                              />

                              {/* is freelancer */}
                              <Field
                                name={`workExperiences[${index}].isFreelancer`}
                                component={CheckboxGroup}
                                options={[
                                  {
                                    value: 'isFreelancer',
                                    label: 'Work as a Freelancer'
                                  }
                                ]}
                                layout="vertical"
                                size="middle"
                              />
                            </div>

                            {/* description */}
                            <Field
                              isRequired
                              name={`workExperiences[${index}].description`}
                              label="Description"
                              component={TextareaForm}
                              as="textarea"
                              placeholder="Description"
                            />
                          </div>
                        </Collapse>
                      </div>
                    ))}

                    <Button
                      type="button"
                      styleType="neon"
                      label="Add Work Experience"
                      onClick={() => push(defaultFormValue)}
                      className="mt-6"
                    />
                  </div>
                )}
              </FieldArray>

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
