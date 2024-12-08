'use client';
import {
  BackButton,
  Button,
  DatePicker,
  EditorForm,
  InputForm,
  SelectForm,
  Steps
} from '@/libraries/common';
import { Field, FieldArray, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { CreateResume, ICreateResumeDataForm, IWorkExperience } from '../providers';
import { Collapse } from '../../../../libraries/common/collapse/collapse';

type WorkExperienceSectionProps = {
  experience: IWorkExperience;
  index: number;
  remove: (index: number) => void;
};

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ index, remove }) => {
  const t = useTranslations();
  return (
    <Collapse remove={remove} index={index} header={t('company')}>
      <div className="mb-6 border-b pb-4">
        <div className="flex flex-1 gap-6">
          <Field
            name={`workExperiences[${index}].jobTitle`}
            label={t('form.jobTitle')}
            component={InputForm}
            placeholder={t('form.jobTitle')}
          />
          <Field
            name={`workExperiences[${index}].companyName`}
            label={t('form.companyName')}
            component={InputForm}
            placeholder={t('form.companyName')}
          />
        </div>
        <Field
          name={`workExperiences[${index}].location`}
          label={t('form.location')}
          placeholder={t('form.location')}
          component={SelectForm}
        />

        <div className="flex flex-1 gap-6">
          <Field
            name={`workExperiences[${index}].startDate`}
            label={t('form.startDate')}
            component={DatePicker}
            type="date"
            isClearable
            placeholder={t('form.startDate')}
          />
          <Field
            name={`workExperiences[${index}].endDate`}
            label={t('form.endDate')}
            component={DatePicker}
            type="date"
            placeholder={t('form.endDate')}
          />
        </div>

        <Field
          name={`workExperiences[${index}].description`}
          label={t('form.description')}
          component={InputForm}
          as="textarea"
          placeholder={t('form.description')}
        />
        <Field
          name={`workExperiences[${index}].summary`}
          label={t('form.summary')}
          component={EditorForm}
          as="textarea"
          className="h-52"
          placeholder={t('form.summary')}
        />
      </div>
    </Collapse>
  );
};

export default function CreateResumeStepOne() {
  const t = useTranslations();
  const {
    actions,
    state: { stepIndex, formData }
  } = CreateResume();

  const onHandleSubmit = async (values: ICreateResumeDataForm) => {
    console.log(values);
    actions.nextStep(values);
    actions.setWorkExperiences(values);
  };

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
  const validationSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: any = {
      workExperiences: Yup.array().of(
        Yup.object().shape({
          jobTitle: Yup.string().required(
            t('validation.required', { label: t('form.jobTitle').toLowerCase() })
          ),
          companyName: Yup.string().required(
            t('validation.required', { label: t('form.companyName').toLowerCase() })
          ),
          location: Yup.object().required(
            t('validation.required', { label: t('form.location').toLowerCase() })
          ),
          startDate: Yup.string().required(
            t('validation.required', { label: t('form.startDate').toLowerCase() })
          ),
          endDate: Yup.string().when('currentWork', {
            is: false,
            then: (schema) =>
              schema.required(t('validation.required', { label: t('form.endDate').toLowerCase() })),
            otherwise: (schema) => schema.nullable()
          }),
          currentWork: Yup.boolean(),
          description: Yup.string().when('currentWork', {
            is: false,
            then: (schema) =>
              schema.required(
                t('validation.required', { label: t('form.description').toLowerCase() })
              ),
            otherwise: (schema) => schema.nullable()
          }),
          summary: Yup.string().when('currentWork', {
            is: false,
            then: (schema) =>
              schema.required(t('validation.required', { label: t('form.summary').toLowerCase() })),
            otherwise: (schema) => schema.nullable()
          })
        })
      )
    };
    return Yup.object(schema);
  }, [t]);
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

      <div className="h-full">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onHandleSubmit}
        >
          {({ values, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FieldArray name="workExperiences">
                {({ remove, push }) => (
                  <div>
                    {values.workExperiences.map((experience, index) => (
                      <WorkExperienceSection
                        key={index}
                        experience={experience}
                        index={index}
                        remove={remove}
                      />
                    ))}
                    <div className="flex justify-start gap-4 mt-5">
                      <Button
                        type="button"
                        onClick={() =>
                          push({
                            jobTitle: '',
                            companyName: '',
                            location: '',
                            startDate: '',
                            endDate: '',
                            currentWork: false,
                            description: '',
                            summary: ''
                          })
                        }
                        styleType="default"
                        label={t('add')}
                      />
                    </div>
                  </div>
                )}
              </FieldArray>
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
