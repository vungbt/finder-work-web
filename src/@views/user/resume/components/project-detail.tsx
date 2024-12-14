'use client';
import { Company, WorkPosition } from '@/configs/graphql/generated';
import { WorkingPositionOptions } from '@/constants/common';
import useCompanies from '@/hooks/redux/company/list/useCompanies';
import useSkills from '@/hooks/redux/skill/useSkills';
import {
  BackButton,
  Button,
  CheckboxGroup,
  Collapse,
  DatePicker,
  InputForm,
  SelectAsync,
  SelectAsyncCreatable,
  SelectForm,
  Steps,
  TextareaForm,
  Upload
} from '@/libraries/common';
import { validationCustoms } from '@/utils/helpers/validation';
import { Field, FieldArray, Form, Formik, FormikErrors } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { useResume } from '../providers/resume-providers';
import { IResumeProjectDetail } from '../providers/resume-providers';

export default function ProjectDetail() {
  const t = useTranslations();
  const {
    actions,
    state: { formData, stepIndex, totalStep }
  } = useResume();
  const projects = useMemo(() => formData?.projects ?? [], [formData.projects]);

  const { options: companies, loading: companyLoading, getCompanies } = useCompanies();
  const { options: skillOptions, loading: skillLoading, getSkills } = useSkills();

  const validationSchema = Yup.object({
    projects: Yup.array().of(
      Yup.object({
        title: Yup.string().required(),
        teamSize: Yup.number().required(),
        description: Yup.string().required(),
        role: validationCustoms.select(t, 'role'),
        techStacks: validationCustoms.selectMultiple(t, 'tech stack', { min: 1 }),
        startAt: Yup.date().required('Start date required'),
        endAt: Yup.date()
          .required(t('validation.required', { label: 'end date' }))
          .min(Yup.ref('startAt'), 'End date must be > start date'),
        company: validationCustoms.select(t, 'company'),
        refeUrls: Yup.array().of(
          Yup.string().required(t('validation.required', { label: t('form.policy') }))
        ),
        isFreelancer: Yup.array().of(
          Yup.string().required(t('validation.required', { label: t('form.policy') }))
        ),
        thumbnail: Yup.object().shape({
          id: Yup.string().required(t('validation.select', { label: 'thumbnail' })),
          url: Yup.string().required(t('validation.select', { label: 'thumbnail' }))
        })
      })
    )
  });

  const defaultFormValue: IResumeProjectDetail = {
    title: '',
    description: '',
    teamSize: 1,
    role: { value: WorkPosition.Staff, label: WorkPosition.Staff },
    techStacks: [],
    startAt: null,
    endAt: null,
    company: null,
    refeUrls: [],
    isFreelancer: [],
    thumbnail: null
  };

  const initialValues: { projects: IResumeProjectDetail[] } = {
    projects: projects.map((item) => ({
      title: item.title ?? '',
      description: item.description ?? '',
      teamSize: item.teamSize ?? '',
      role: item?.role ?? { value: WorkPosition.Staff, label: WorkPosition.Staff },
      techStacks: item?.techStacks ?? [],
      startAt: item?.startAt ?? null,
      endAt: item?.endAt ?? null,
      company: item?.company ?? null,
      refeUrls: item?.refeUrls ?? [],
      isFreelancer: item?.isFreelancer ?? [],
      thumbnail: item?.thumbnail ?? null
    }))
  };

  // submit register new account
  const onHandleSubmit = async (values: { projects: IResumeProjectDetail[] }) => {
    try {
      console.log('values====>', values);
      actions.nextStep({ ...formData, projects: values.projects ?? [] });
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

  const filterSkill = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getSkills({
      searchValue: searchValue,
      pagination: { limit: 30, page: 1 }
    });
    const options = (res?.all_skill.data ?? []).map((item) => ({
      label: item.content,
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
      <h1 className="text-3xl font-bold mt-4">Projects</h1>

      {/** form content */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}
      >
        {({ values, setFieldValue, errors, setErrors }) => {
          return (
            <Form>
              <FieldArray name="projects">
                {({ remove, push }) => (
                  <div>
                    {(values.projects ?? []).map((projectItem, index) => {
                      const errorItem = (errors.projects ?? [])[
                        index
                      ] as FormikErrors<IResumeProjectDetail>;
                      return (
                        <div key={index} className="border-black border rounded-2xl mt-5">
                          <Collapse remove={remove} index={index} header={'Project'}>
                            <div className="flex flex-col gap-6">
                              <Field
                                label={t('common.title')}
                                isRequired
                                name={`projects[${index}].title`}
                                component={InputForm}
                                placeholder="Enter title"
                              />

                              {/* team size */}
                              <Field
                                label="Team size"
                                isRequired
                                type="number"
                                name={`projects[${index}].teamSize`}
                                component={InputForm}
                                placeholder={t('placeholder.enter', {
                                  label: 'team size'
                                })}
                              />

                              {/* role */}
                              <Field
                                label="Role"
                                isRequired
                                name={`projects[${index}].role`}
                                options={WorkingPositionOptions.map((item) => ({
                                  label: t(item.label),
                                  value: item.value
                                }))}
                                component={SelectForm}
                                placeholder={t('placeholder.enter', {
                                  label: 'role'
                                })}
                              />

                              {/* tech stacks - skills */}
                              <Field
                                label="Tech stacks"
                                isRequired
                                name={`projects[${index}].techStacks`}
                                component={SelectAsync}
                                isMulti={true}
                                loading={skillLoading}
                                filterOptions={filterSkill}
                                defaultOptions={skillOptions}
                                placeholder={t('placeholder.select', {
                                  label: 'tech stacks'
                                })}
                              />

                              <div className="flex flex-1 gap-6">
                                <Field
                                  isRequired
                                  name={`projects[${index}].startAt`}
                                  label="Start date"
                                  component={DatePicker}
                                  isClearable
                                  type="date"
                                  placeholder={t('form.startDate')}
                                />
                                <Field
                                  isRequired
                                  name={`projects[${index}].endAt`}
                                  label="End date"
                                  component={DatePicker}
                                  isClearable
                                  type="date"
                                  placeholder={t('form.endDate')}
                                />
                              </div>

                              {/* company */}
                              <Field
                                label={`${t('company')}:`}
                                isRequired
                                name={`projects[${index}].company`}
                                component={SelectAsyncCreatable}
                                defaultOptions={companies}
                                loading={companyLoading}
                                filterOptions={filterCompanies}
                                placeholder={t('placeholder.selectOrCreate', {
                                  label: t('company').toLowerCase()
                                })}
                              />

                              {/* is freelancer */}
                              <Field
                                name={`projects[${index}].isFreelancer`}
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

                              {/* refer urls */}

                              <FieldArray
                                name={`projects.${index}.refeUrls`}
                                render={(arrayHelpers) => (
                                  <div>
                                    <h2 className="text-lg font-semibold">Refer URLs</h2>
                                    {projectItem.refeUrls.map((_, urlIndex) => (
                                      <div
                                        key={urlIndex}
                                        className="border-black border rounded-2xl mt-5"
                                      >
                                        <Collapse
                                          remove={remove}
                                          index={urlIndex}
                                          header={'Refer link'}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Field
                                              label="Refer link"
                                              isRequired
                                              name={`projects.${index}.refeUrls.${urlIndex}`}
                                              component={InputForm}
                                              placeholder="Enter URL"
                                            />
                                          </div>
                                        </Collapse>
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      label="Add URL"
                                      styleType="neon"
                                      onClick={() => arrayHelpers.push('')}
                                      className="mt-6"
                                    />
                                  </div>
                                )}
                              />

                              {/* description */}
                              <Field
                                isRequired
                                name={`projects[${index}].description`}
                                label="Description"
                                component={TextareaForm}
                                as="textarea"
                                placeholder="Description"
                              />

                              <Upload
                                isRequired={true}
                                label="Thumbnail"
                                name={`projects[${index}].thumbnail`}
                                value={projectItem.thumbnail}
                                // placeholder="Drop or Drag a photo"
                                // subPlaceholder="Supported png, jpeg, jpg, webp, gif"
                                onChange={(value) => {
                                  setFieldValue(`projects[${index}].thumbnail`, value);
                                }}
                                error={errorItem?.thumbnail}
                                setError={(mess) => setErrors(mess)}
                              />
                            </div>
                          </Collapse>
                        </div>
                      );
                    })}
                    <Button
                      type="button"
                      label="Add Project"
                      styleType="neon"
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
