'use client';
import { SocialTypeOptions } from '@/constants/common';
import useLanguageSkills from '@/hooks/redux/language-skill/useLanguageSkills';
import useSkills from '@/hooks/redux/skill/useSkills';
import {
  BackButton,
  Button,
  Collapse,
  DatePicker,
  InputForm,
  SelectAsync,
  SelectForm,
  Steps,
  TextareaForm,
  Upload
} from '@/libraries/common';
import { validationCustoms } from '@/utils/helpers/validation';
import { Field, FieldArray, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { IResumeMoreInformation, useResume } from '../providers/resume-providers';

export default function MoreInformation() {
  const t = useTranslations();
  const {
    actions,
    state: { formData, stepIndex, totalStep }
  } = useResume();
  const moreInformation = useMemo(() => formData.moreInformation, [formData.moreInformation]);
  const { options: skillOptions, loading: skillLoading, getSkills } = useSkills();
  const {
    options: languageSkillOptions,
    loading: languageSkillLoading,
    getLanguageSkills
  } = useLanguageSkills();

  const validationSchema = Yup.object({
    languageSkills: validationCustoms.selectMultiple(t, 'language skill', { min: 1 }),
    skills: validationCustoms.selectMultiple(t, 'skill', { min: 1 }),
    certificates: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Certificate name is required'),
        file: validationCustoms.upload(t, 'certificate')
      })
    ),
    socials: Yup.array().of(
      Yup.object({
        type: validationCustoms.select(t, 'social type'),
        url: Yup.string().url('Invalid URL format').required('Social URL is required')
      })
    ),
    activities: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Activity name is required'),
        startAt: Yup.date().required('Start date is required'),
        endAt: Yup.date()
          .required('End date is required')
          .min(Yup.ref('startAt'), 'End date must be after start date'),
        description: Yup.string().required('Description is required')
      })
    )
  });

  const initialValues: IResumeMoreInformation = {
    languageSkills: moreInformation?.languageSkills ?? [],
    skills: moreInformation?.skills ?? [],
    certificates: moreInformation?.certificates ?? [],
    socials: moreInformation?.socials ?? [],
    activities: moreInformation?.activities ?? []
  };

  // submit register new account
  const onHandleSubmit = async (values: IResumeMoreInformation) => {
    try {
      actions.nextStep({ ...formData, moreInformation: values });
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

  const filterLanguageSkill = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getLanguageSkills({
      searchValue: searchValue,
      pagination: { limit: 20, page: 1 }
    });
    const options = (res?.all_language_skill.data ?? []).map((item) => ({
      label: `${item.name} - ${item.proficiencyLevel}`,
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
      <h1 className="text-3xl font-bold mt-4">More information</h1>

      {/** form content */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}
      >
        {({ values, setErrors, setFieldValue }) => {
          return (
            <Form>
              <div className="flex flex-col gap-6 ">
                <div className=" border-black border rounded-2xl mt-5 justify-items-center ">
                  <div className="w-11/12 my-10">
                    <Field
                      label="Language skills"
                      isRequired
                      name="languageSkills"
                      component={SelectAsync}
                      isMulti={true}
                      loading={languageSkillLoading}
                      filterOptions={filterLanguageSkill}
                      defaultOptions={languageSkillOptions}
                      placeholder={t('placeholder.select', {
                        label: 'tech stacks'
                      })}
                    />
                    <Field
                      label="Skills"
                      isRequired
                      name="skills"
                      component={SelectAsync}
                      isMulti={true}
                      loading={skillLoading}
                      filterOptions={filterSkill}
                      defaultOptions={skillOptions}
                      placeholder={t('placeholder.select', {
                        label: 'tech stacks'
                      })}
                    />

                    {/* Certificates */}
                    <FieldArray name="certificates">
                      {({ remove, push }) => (
                        <div>
                          <h2>Certificates</h2>
                          {(values.certificates ?? []).map((certificateItem, certificateIndex) => (
                            <div
                              className=" border-black border rounded-2xl mt-5"
                              key={certificateIndex}
                            >
                              <Collapse
                                remove={remove}
                                index={certificateIndex}
                                header={'Certificate'}
                              >
                                <div>
                                  <Field
                                    label="Certificate name"
                                    isRequired
                                    name={`certificates[${certificateIndex}].name`}
                                    component={InputForm}
                                    placeholder="Enter name"
                                  />
                                  <Upload
                                    isRequired={true}
                                    label="File"
                                    name={`certificates[${certificateIndex}].file`}
                                    value={certificateItem.file}
                                    placeholder="Drop or Drag a photo"
                                    subPlaceholder="Supported png, jpeg, jpg, webp, gif"
                                    onChange={(value) => {
                                      setFieldValue(
                                        `certificates[${certificateIndex}].file`,
                                        value
                                      );
                                    }}
                                    setError={(mess) => setErrors(mess)}
                                  />
                                </div>
                              </Collapse>
                            </div>
                          ))}
                          <Button
                            type="button"
                            styleType="neon"
                            label="Add certificate"
                            onClick={() => push({ name: '', file: null })}
                            className="mt-6"
                          />
                        </div>
                      )}
                    </FieldArray>

                    {/* Socials */}
                    <FieldArray name="socials">
                      {({ remove, push }) => (
                        <div className="mt-5">
                          <h3>Socials</h3>
                          {(values.socials ?? []).map((_, socialIndex) => (
                            <div
                              key={socialIndex}
                              className=" border-black border rounded-2xl mt-5"
                            >
                              <Collapse remove={remove} index={socialIndex} header={'Social'}>
                                <div key={socialIndex}>
                                  <Field
                                    label="Social type"
                                    isRequired
                                    name={`socials[${socialIndex}].type`}
                                    component={SelectForm}
                                    options={SocialTypeOptions.map((item) => ({
                                      label: t(item.label),
                                      value: item.value
                                    }))}
                                    placeholder="Select type"
                                  />

                                  <Field
                                    label="Social url"
                                    isRequired
                                    name={`socials[${socialIndex}].url`}
                                    component={InputForm}
                                    placeholder="Enter url"
                                  />
                                </div>
                              </Collapse>
                            </div>
                          ))}
                          <Button
                            type="button"
                            styleType="neon"
                            label="Add social"
                            onClick={() => push({ type: '', url: '' })}
                            className="mt-6"
                          />
                        </div>
                      )}
                    </FieldArray>

                    {/* Activities */}
                    <FieldArray name="activities">
                      {({ remove, push }) => (
                        <div className="mt-5">
                          <h3>Activities</h3>
                          {(values.activities ?? []).map((_, activityIndex) => (
                            <div
                              key={activityIndex}
                              className=" border-black border rounded-2xl mt-5"
                            >
                              <Collapse remove={remove} index={activityIndex} header={'Activity'}>
                                <div key={activityIndex}>
                                  <Field
                                    label="Activity name"
                                    isRequired
                                    name={`activities[${activityIndex}].name`}
                                    component={InputForm}
                                    placeholder="Enter name"
                                  />

                                  <div className="flex flex-1 gap-6">
                                    <Field
                                      isRequired
                                      name={`activities[${activityIndex}].startAt`}
                                      label="Start date"
                                      component={DatePicker}
                                      isClearable
                                      type="date"
                                      placeholder={t('form.startDate')}
                                    />
                                    <Field
                                      isRequired
                                      name={`activities[${activityIndex}].endAt`}
                                      label="End date"
                                      component={DatePicker}
                                      isClearable
                                      type="date"
                                      placeholder={t('form.endDate')}
                                    />
                                  </div>
                                  <Field
                                    isRequired
                                    name={`activities[${activityIndex}].description`}
                                    label="Description"
                                    component={TextareaForm}
                                    placeholder="Description"
                                  />
                                </div>
                              </Collapse>
                            </div>
                          ))}
                          <Button
                            type="button"
                            styleType="neon"
                            label="Add social"
                            onClick={() =>
                              push({ name: '', startAt: '', endAt: '', description: '' })
                            }
                            className="mt-6"
                          />
                        </div>
                      )}
                    </FieldArray>
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
