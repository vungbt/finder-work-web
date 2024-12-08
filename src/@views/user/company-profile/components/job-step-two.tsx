'use client';
import { AdminSkillManagementUtils } from '@/@handles/skill/skill.utils';
import { Skill, Tag, TagType } from '@/configs/graphql/generated';
import {
  BackButton,
  Button,
  EditorForm,
  InputForm,
  SelectAsyncCreatable,
  Steps
} from '@/libraries/common';
import { IOptItem } from '@/types';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { IDescriptionSkill, useJob } from '../providers';
import { useMemo } from 'react';
import * as Yup from 'yup';
import useTags from '@/hooks/redux/tags/useTags';

export default function CreateResumeStepOne() {
  const t = useTranslations();
  const {
    actions,
    state: { formData, stepIndex }
  } = useJob();
  const { jobTagOptions, getTags, loading: loadingTagOption } = useTags();

  const onHandleSubmit = async (values: IDescriptionSkill) => {
    try {
      actions.nextStep({ ...formData, descriptionSkill: values });
    } catch (error) {
      console.log('error====>', error);
    }
  };
  const {
    data: SkillData,
    setSearchValue: setSearchValueSKill,
    loading: loadingSkill
  } = AdminSkillManagementUtils();

  const validationSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: any = {
      skill: Yup.array()
        .of(
          Yup.object().shape({
            value: Yup.string().required(
              t('validation.required', { label: t('skill').toLowerCase() })
            ),
            label: Yup.string().required(
              t('validation.required', { label: t('skill').toLowerCase() })
            )
          })
        )
        .min(1, t('validation.required', { label: t('skill').toLowerCase() })),
      description: Yup.string().required(
        t('validation.required', { label: t('form.description').toLowerCase() })
      ),
      tags: Yup.array()
        .of(
          Yup.object().shape({
            value: Yup.string().required(
              t('validation.required', { label: t('tags').toLowerCase() })
            ),
            label: Yup.string().required(
              t('validation.required', { label: t('tags').toLowerCase() })
            )
          })
        )
        .min(1, t('validation.required', { label: t('tags').toLowerCase() }))
    };
    return Yup.object(schema);
  }, [t]);
  const SkillOpt: IOptItem[] = SkillData?.map((item) => ({
    label: item.content,
    value: item.id
  }));
  const initialValues: IDescriptionSkill = {
    description: formData.descriptionSkill?.description ?? '',
    skill: formData.descriptionSkill?.skill ?? [],
    tags: formData.descriptionSkill?.tags ?? [],
    numberOfRecruits: formData.descriptionSkill?.numberOfRecruits ?? 1
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

  const filterTags = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getTags({
      where: { type: { equals: TagType.Job } },
      searchValue: searchValue
    });
    const options = ((res.all_tag.data ?? []) as Tag[]).map((item) => ({
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
        <Formik<IDescriptionSkill>
          initialValues={initialValues}
          onSubmit={onHandleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div>
                <Field
                  label={`${t('common.numberOfRecruits')}:`}
                  isRequired
                  name="numberOfRecruits"
                  component={InputForm}
                  placeholder={t('form.contentInput')}
                />
                <Field
                  name={'description'}
                  label={t('form.description')}
                  component={EditorForm}
                  isRequired
                  placeholder={t('form.description')}
                />
                <Field
                  label={t('common.tags')}
                  isRequired
                  name="tags"
                  component={SelectAsyncCreatable}
                  loading={loadingTagOption}
                  filterOptions={filterTags}
                  isMulti={true}
                  defaultOptions={jobTagOptions}
                  placeholder={t('placeholder.select', {
                    label: t('common.tags').toLowerCase()
                  })}
                />
                <Field
                  label={`${t('skill')}:`}
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
