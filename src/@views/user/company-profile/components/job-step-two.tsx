'use client';
import { BackButton, Button, EditorForm, SelectAsyncCreatable, Steps } from '@/libraries/common';
import { Field, FieldArray, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { CreateResume, ICreateResumeDataForm, IWorkExperience } from '../providers';
import { AdminSkillManagementUtils } from '@/@handles/skill/skill.utils';
import { Skill } from '@/configs/graphql/generated';
import { IOptItem } from '@/types';

export default function CreateResumeStepOne() {
  const t = useTranslations();
  const {
    actions,
    state: { stepIndex, formData }
  } = CreateResume();

  const onHandleSubmit = async (values: ICreateResumeDataForm) => {
    actions.nextStep(values);
    actions.setWorkExperiences(values);
  };
  const {
    data: SkillData,
    setSearchValue: setSearchValueSKill,
    loading: loadingSkill
  } = AdminSkillManagementUtils();

  const SkillOpt: IOptItem[] = SkillData?.map((item) => ({
    label: item.content,
    value: item.id
  }));
  const initialValues: ICreateResumeDataForm & { workExperiences: IWorkExperience[] } = {
    ...formData,
    workExperiences:
      formData?.workExperiences?.length > 0
        ? formData.workExperiences
        : [
            {
              jobTitle: '',
              companyName: '',
              location: null,
              startDate: '',
              endDate: '',
              description: '',
              summary: ''
            }
          ]
  };

  const filterJobTitle = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    setSearchValueSKill(searchValue);
    const options = ((SkillData ?? []) as Skill[]).map((item) => ({
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
      className="w-3/4 ms-6"
    >
      {/* Step Indicator */}
      <Steps
        steps={5}
        excludeSteps={[2]}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />
      <div>Description</div>
      <div className="h-full">
        <Formik<any> initialValues={initialValues} onSubmit={onHandleSubmit}>
          {({ values, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div>
                <Field
                  name={'description'}
                  label={t('form.description')}
                  component={EditorForm}
                  as="textarea"
                  className="h-52"
                  placeholder={t('form.description')}
                />

                <Field
                  label={`${t('common.skill')}:`}
                  isRequired
                  name="skill"
                  component={SelectAsyncCreatable}
                  loading={loadingSkill}
                  filterOptions={filterJobTitle}
                  defaultOptions={SkillOpt}
                  isMulti={true}
                  placeholder={t('placeholder.select', {
                    label: t('common.jobTitle').toLowerCase()
                  })}
                />
              </div>
              <div className="flex flex-1 justify-between my-10">
                <BackButton onClick={() => actions.previousStep(formData)} />
                <Button type="submit" styleType="info" label={t('common.next')} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
}
