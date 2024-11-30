import { BackButton, Button, DatePicker, InputForm, Steps } from '@/libraries/common';
import { Field, FieldArray, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { CreateResume, ICreateResumeDataForm, IEducation } from '../providers';
import { Collapse } from '../../../../libraries/common/collapse/collapse';

type WorkExperienceSectionProps = {
  education: IEducation;
  index: number;
  remove: (index: number) => void;
};

const EducationSection: React.FC<WorkExperienceSectionProps> = ({ index, remove }) => {
  const t = useTranslations();
  return (
    <Collapse remove={remove} index={index} header={'school'}>
      <div className="mb-6 border-b pb-4">
        <Field
          name={`educations[${index}].school`}
          label={t('form.education')}
          component={InputForm}
          placeholder={t('form.school')}
        />
        <div className="flex flex-1 gap-6">
          <Field
            name={`educations[${index}].major`}
            label={t('form.major')}
            component={InputForm}
            placeholder={t('form.major')}
          />
          <Field
            name={`educations[${index}].degree`}
            label={t('form.degree')}
            component={InputForm}
            placeholder={t('form.degree')}
          />
        </div>
        <div className="flex flex-1 gap-6">
          <Field
            name={`educations[${index}].startDate`}
            label={t('form.education')}
            component={DatePicker}
            type="date"
            placeholder={t('form.startDate')}
          />
          <Field
            name={`educations[${index}].endDate`}
            label={t('form.endDate')}
            component={DatePicker}
            type="date"
            placeholder={t('form.endDate')}
          />
        </div>

        <Field
          name={`educations[${index}].gpa`}
          label={t('form.gpa')}
          component={InputForm}
          as="textarea"
          placeholder={t('form.gpa')}
        />
        <Field
          name={`educations[${index}].awards`}
          label={t('form.awards')}
          component={InputForm}
          as="textarea"
          placeholder={t('form.awards')}
        />
        <Field
          name={`educations[${index}].relevantCoursework`}
          label={t('form.relevantCoursework')}
          component={InputForm}
          as="textarea"
          placeholder={t('form.relevantCoursework')}
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

  const initialValues: ICreateResumeDataForm & { educations: IEducation[] } = {
    ...formData,
    educations: formData?.educations?.length
      ? formData.educations
      : [
          {
            school: '',
            major: '',
            degree: '',
            startDate: '',
            endDate: '',
            gpa: '',
            awards: '',
            relevantCoursework: ''
          }
        ]
  };
  const validationSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: any = {
      educations: Yup.array().of(
        Yup.object().shape({
          school: Yup.string().required(
            t('validation.required', { label: t('form.school').toLowerCase() })
          ),
          major: Yup.string().required(
            t('validation.required', { label: t('form.major').toLowerCase() })
          ),
          degree: Yup.string().required(
            t('validation.required', { label: t('form.degree').toLowerCase() })
          ),
          startDate: Yup.string().required(
            t('validation.required', { label: t('form.startDate').toLowerCase() })
          ),
          endDate: Yup.string().when('currentLearning', {
            is: (currentLearning: boolean) => !currentLearning,
            then: (schema) =>
              schema.required(t('validation.required', { label: t('form.endDate').toLowerCase() })),
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
      {/** step active */}
      <Steps
        steps={5}
        excludeSteps={[3]}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}
      >
        {({ values, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <FieldArray name="educations">
              {({ remove, push }) => (
                <div>
                  {values.educations.map((education, index) => (
                    <EducationSection
                      key={index}
                      education={education}
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
    </motion.div>
  );
}
