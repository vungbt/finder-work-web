import useCountries from '@/hooks/redux/countries/useCountries';
import {
  BackButton,
  Button,
  CheckboxGroup,
  InputForm,
  InputPasswordForm,
  SelectForm,
  Steps
} from '@/libraries/common';
import { RegexHelper } from '@/utils/helpers/regex';
import { Link } from '@/utils/navigation';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';
import { IEmployerRegister, useSignUpEmployer } from '../providers';

export default function SignUpEmployerStepThree() {
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
      })
  });

  const initialValues = {
    firstName: formData.firstName ?? '',
    lastName: formData.lastName ?? '',
    phoneCode: formData.phoneCode ?? defaultOption,
    phoneNumber: formData.phoneNumber ?? '',
    workingPosition: formData.workingPosition ?? undefined
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
      <h1 className="text-3xl font-bold mt-4">{t('companyInformation')}</h1>
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

                <Field
                  label={`${t('form.password')}:`}
                  isRequired
                  name="password"
                  component={InputPasswordForm}
                  placeholder={t('form.password')}
                />

                <Field
                  label={`${t('form.confirmPassword')}:`}
                  isRequired
                  name="confirmPassword"
                  component={InputPasswordForm}
                  placeholder={t('form.confirmPassword')}
                />
              </div>

              <div className="flex items-center justify-start mt-6">
                <Field
                  name="agreePolicy"
                  component={CheckboxGroup}
                  options={[
                    {
                      value: 'apple',
                      label: (
                        <div className="flex items-center text-sm md:text-base text-dark gap-[5px] cursor-pointer">
                          {t('common.agreeTo')}{' '}
                          <Link
                            href="/"
                            target="_blank"
                            className="underline transition-all ease-linear hover:text-info"
                          >
                            {t('common.termsOfUse')}
                          </Link>
                          <span>{t('common.and')}</span>
                          <Link
                            href="/"
                            target="_blank"
                            className="capitalize underline transition-all ease-linear hover:text-info"
                          >
                            {t('common.privacyPolicy')}
                          </Link>
                        </div>
                      )
                    }
                  ]}
                  layout="vertical"
                  size="middle"
                />
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
