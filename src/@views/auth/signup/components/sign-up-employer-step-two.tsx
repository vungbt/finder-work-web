import { WorkingPositionOptions } from '@/constants/common';
import useCountries from '@/hooks/redux/countries/useCountries';
import { BackButton, Button, InputForm, SelectForm, Steps } from '@/libraries/common';
import { RegexHelper } from '@/utils/helpers/regex';
import { validationCustoms } from '@/utils/helpers/validation';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';
import { IEmployerRegister, useSignUpEmployer } from '../providers';

export default function SignUpEmployerStepTwo() {
  const t = useTranslations();
  const {
    actions,
    state: { stepIndex, formData }
  } = useSignUpEmployer();
  const { options, defaultOption } = useCountries();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().required(
      t('validation.required', { label: t('form.firstName').toLowerCase() })
    ),
    lastName: Yup.string().required(
      t('validation.required', { label: t('form.lastName').toLowerCase() })
    ),
    phoneCode: Yup.object().shape({
      value: Yup.string().required(t('validation.optionRequired')),
      label: Yup.string().required(t('validation.optionRequired'))
    }),
    phoneNumber: Yup.string()
      .required(t('validation.required', { label: t('form.phoneNumber').toLowerCase() }))
      .matches(RegexHelper.REGEX_PHONE, {
        message: t('validation.valid', { label: t('form.phoneNumber').toLowerCase() })
      }),
    workingPosition: validationCustoms.select(t, t('form.workingPosition'))
  });

  const initialValues = {
    firstName: formData.firstName ?? '',
    lastName: formData.lastName ?? '',
    phoneCode: formData.phoneCode ?? defaultOption,
    phoneNumber: formData.phoneNumber ?? '',
    workingPosition: formData.workingPosition ?? null
  };

  // submit register new account
  const onHandleSubmit = async (values: IEmployerRegister) => {
    try {
      if (loading) return;
      setLoading(true);
      actions.nextStep(values);
    } catch (error) {
      setLoading(false);
    }
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
      className="mx-auto pb-10"
    >
      <BackButton onClick={() => actions.previousStep(formData)} />
      <h1 className="text-3xl font-bold mt-4">{t('personalInformation')}</h1>

      {/** step active */}
      <Steps
        steps={5}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />

      {/** form content */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}
      >
        {() => {
          return (
            <Form>
              <div className="flex flex-col gap-6">
                <Field
                  label={`${t('form.firstName')}:`}
                  isRequired
                  name="firstName"
                  component={InputForm}
                  placeholder={t('form.firstName')}
                />
                <Field
                  label={`${t('form.lastName')}:`}
                  isRequired
                  name="lastName"
                  component={InputForm}
                  placeholder={t('form.lastName')}
                />

                {/* working position */}
                <Field
                  label={t('form.workingPosition')}
                  isRequired={true}
                  name="workingPosition"
                  component={SelectForm}
                  options={WorkingPositionOptions.map((item) => ({
                    label: t(item.label),
                    value: item.value
                  }))}
                  placeholder={t('placeholder.select', {
                    label: t('form.workingPosition').toLowerCase()
                  })}
                />

                {/** phone number */}
                <div className="flex items-center flex-wrap gap-2">
                  <div className="w-fit min-w-40">
                    <Field
                      label={`${t('form.phoneCode')}:`}
                      isRequired
                      name="phoneCode"
                      component={SelectForm}
                      options={options}
                      placeholder={t('form.phoneCode')}
                    />
                  </div>
                  <div className="flex-1">
                    <Field
                      label={`${t('form.phoneNumber')}:`}
                      isRequired
                      name="phoneNumber"
                      component={InputForm}
                      placeholder={t('form.phoneNumber')}
                    />
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
