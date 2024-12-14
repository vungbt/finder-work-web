'use client';
import { DegreeOptions, EducationTypeOptions } from '@/constants/common';
import useSkills from '@/hooks/redux/skill/useSkills';
import {
  BackButton,
  Button,
  Collapse,
  DatePicker,
  InputForm,
  SelectAsync,
  SelectForm,
  Steps
} from '@/libraries/common';
import { validationCustoms } from '@/utils/helpers/validation';
import { Field, FieldArray, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';

import { IResumeEducation, useResume } from '../providers/resume-providers';

export default function EducationDetail() {
  const t = useTranslations();
  const {
    actions,
    state: { formData, stepIndex, totalStep }
  } = useResume();
  const educations = useMemo(() => formData?.educations ?? [], [formData.educations]);
  const { options: skillOptions, loading: skillLoading, getSkills } = useSkills();

  const validationSchema = Yup.object({
    educations: Yup.array().of(
      Yup.object({
        type: validationCustoms.select(t, 'type'),
        major: validationCustoms.select(t, 'major'),
        degree: validationCustoms.select(t, 'degree'),
        graduationAt: Yup.date().required('Start date required'),
        gpa: Yup.number().required(),
        awards: Yup.array(
          Yup.string().required(t('validation.required', { label: t('form.policy') }))
        ),
        relevantCourseWorks: Yup.array(
          Yup.string().required(t('validation.required', { label: t('form.policy') }))
        )
      })
    )
  });

  const defaultFormValue: IResumeEducation = {
    type: null,
    major: null, // skill
    degree: null,
    graduationAt: null,
    gpa: 1,
    awards: [],
    relevantCourseWorks: []
  };

  const initialValues: { educations: IResumeEducation[] } = {
    educations: educations.map((item) => ({
      type: item?.type ?? null,
      major: item?.major ?? null, // skill
      degree: item?.degree ?? null,
      graduationAt: item?.graduationAt ?? null,
      gpa: item?.gpa ?? 1,
      awards: item?.awards ?? [],
      relevantCourseWorks: item?.relevantCourseWorks ?? []
    }))
  };

  // submit register new account
  const onHandleSubmit = async (values: { educations: IResumeEducation[] }) => {
    try {
      console.log('values====>', values);
      actions.nextStep({ ...formData, educations: values.educations ?? [] });
    } catch (error) {
      console.log('error====>', error);
    }
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
      className="mx-auto pb-10 w-full max-w-4xl px-4 sm:px-6 lg:px-8"
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
      <h1 className="text-3xl font-bold mt-4">Educations</h1>

      {/** form content */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}
      >
        {({ values }) => {
          return (
            <Form>
              <FieldArray name="educations">
                {({ remove, push }) => (
                  <div className="border-info">
                    {(values.educations ?? []).map((educationItem, index) => {
                      return (
                        <div key={index} className=" border-black border rounded-2xl mt-5">
                          <Collapse remove={remove} index={index} header={'School'} key={index}>
                            <div className="flex flex-col gap-6">
                              {/* type */}
                              <Field
                                label="Type"
                                isRequired
                                name={`educations[${index}].type`}
                                options={EducationTypeOptions.map((item) => ({
                                  label: t(item.label),
                                  value: item.value
                                }))}
                                component={SelectForm}
                                placeholder={t('placeholder.enter', {
                                  label: 'type'
                                })}
                              />

                              {/* major */}
                              <Field
                                label="Major"
                                isRequired
                                name={`educations[${index}].major`}
                                component={SelectAsync}
                                loading={skillLoading}
                                filterOptions={filterSkill}
                                defaultOptions={skillOptions}
                                placeholder={t('placeholder.select', {
                                  label: 'major'
                                })}
                              />

                              {/* degree */}
                              <Field
                                label="Degree"
                                isRequired
                                name={`educations[${index}].degree`}
                                options={DegreeOptions.map((item) => ({
                                  label: t(item.label),
                                  value: item.value
                                }))}
                                component={SelectForm}
                                placeholder={t('placeholder.enter', {
                                  label: 'degree'
                                })}
                              />

                              {/* graduation */}
                              <Field
                                isRequired
                                name={`educations[${index}].graduationAt`}
                                label="Graduation date"
                                component={DatePicker}
                                isClearable
                                type="date"
                                placeholder="Select date"
                              />

                              {/* gpa */}
                              <Field
                                label="GPA"
                                isRequired
                                type="number"
                                name={`educations[${index}].gpa`}
                                component={InputForm}
                                placeholder={t('placeholder.enter', {
                                  label: 'gpa'
                                })}
                              />

                              {/* awards */}

                              <h2 className="text-lg font-semibold">Awards</h2>
                              <FieldArray
                                name={`educations.${index}.awards`}
                                render={(arrayHelpers) => (
                                  <div>
                                    {educationItem.awards.map((_, awardIndex) => (
                                      <div
                                        key={awardIndex}
                                        className=" border-black border rounded-2xl mt-5"
                                      >
                                        <Collapse
                                          remove={remove}
                                          index={awardIndex}
                                          header={'Award'}
                                          key={awardIndex}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Field
                                              label="Award"
                                              isRequired
                                              name={`educations.${index}.awards.${awardIndex}`}
                                              component={InputForm}
                                              placeholder="Enter award"
                                            />
                                          </div>
                                        </Collapse>
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      label="Add Award"
                                      styleType="neon"
                                      onClick={() => arrayHelpers.push('')}
                                      className="mt-4 !w-fit"
                                    />
                                  </div>
                                )}
                              />

                              {/* relevantCourseWorks */}
                              <h2 className="text-lg font-semibold">Relevant course work</h2>
                              <FieldArray
                                name={`educations.${index}.relevantCourseWorks`}
                                render={(arrayHelpers) => (
                                  <div>
                                    {educationItem.relevantCourseWorks.map(
                                      (_, relevantCourseWorkIndex) => (
                                        <div
                                          key={relevantCourseWorkIndex}
                                          className=" border-black border rounded-2xl mt-5"
                                        >
                                          <Collapse
                                            remove={remove}
                                            index={relevantCourseWorkIndex}
                                            header={'Relevant Course Work'}
                                            key={relevantCourseWorkIndex}
                                          >
                                            <div className="flex items-center gap-2">
                                              <Field
                                                label="Relevant course work"
                                                isRequired
                                                name={`educations.${index}.relevantCourseWorks.${relevantCourseWorkIndex}`}
                                                component={InputForm}
                                                placeholder="Enter relevant course work"
                                              />
                                            </div>
                                          </Collapse>
                                        </div>
                                      )
                                    )}
                                    <Button
                                      type="button"
                                      label="Add Relevant Course Work"
                                      onClick={() => arrayHelpers.push('')}
                                      styleType="neon"
                                      className="mt-4 !w-fit"
                                    />
                                  </div>
                                )}
                              />
                            </div>
                          </Collapse>
                        </div>
                      );
                    })}
                    <Button
                      type="button"
                      label="Add Education"
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
