import { toastSuccess } from '@/configs/toast';
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
import { useApiClient } from '@/libraries/providers/graphql';
import { RegexHelper } from '@/utils/helpers/regex';
import { Link } from '@/utils/navigation';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';
import { IEmployeeRegister, useSignUpEmployee } from '../providers';
import { UserOnly } from '@/configs/graphql/generated';

export default function SignUpEmployeeStepOne() {
  const t = useTranslations();
  const {
    actions,
    state: { stepIndex, formData }
  } = useSignUpEmployee();
  const { apiClient } = useApiClient();
  const { options, defaultOption } = useCountries();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(t('validation.required', { label: t('form.email').toLowerCase() }))
      .trim()
      .email(t('validation.valid', { label: t('form.email').toLowerCase() })),
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
    password: Yup.string()
      .required(t('validation.required', { label: t('form.password').toLowerCase() }))
      .trim()
      .min(8, t('validation.min', { label: t('form.password').toLowerCase(), number: 8 }))
      .max(20, t('validation.max', { label: t('form.password').toLowerCase(), number: 20 }))
      .matches(RegexHelper.REGEX_PASSWORD, t('validation.passwordInvalid')),
    confirmPassword: Yup.string()
      .required(t('validation.required', { label: t('form.confirmPassword').toLowerCase() }))
      .trim()
      .min(8, t('validation.min', { label: t('form.confirmPassword').toLowerCase(), number: 8 }))
      .max(20, t('validation.max', { label: t('form.confirmPassword').toLowerCase(), number: 20 }))
      .matches(RegexHelper.REGEX_PASSWORD, t('validation.passwordInvalid'))
      .oneOf([Yup.ref('password')], t('validation.passwordMustMatch')),
    agreePolicy: Yup.array()
      .of(Yup.string().required(t('validation.required', { label: t('form.policy') })))
      .min(1, t('validation.required', { label: t('form.policy') }))
  });

  const initialValues = {
    email: formData.email ?? '',
    firstName: formData.firstName ?? '',
    lastName: formData.lastName ?? '',
    phoneCode: formData.phoneCode ?? defaultOption,
    phoneNumber: formData.phoneNumber ?? '',
    password: formData?.password ?? '',
    confirmPassword: formData?.confirmPassword ?? '',
    agreePolicy: formData?.agreePolicy ?? []
  };

  // submit register new account
  const onHandleSubmit = async (values: IEmployeeRegister) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await apiClient.authEmployeeRegister({ ...values });
      setLoading(false);
      const result = res?.auth_employee_register;
      if (result.id) {
        toastSuccess(t('noti.registerSuccess'));
        actions.nextStep(values);
        actions.setUserTemp(result as UserOnly);
      }
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
      className="mx-auto"
    >
      <BackButton onClick={() => actions.previousStep(formData)} />

      {/** step active */}
      <Steps
        steps={4}
        excludeSteps={[0]}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />

      {/** form content */}
      <Formik<IEmployeeRegister>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}
      >
        {() => {
          return (
            <Form>
              <div className="flex flex-col gap-6">
                <Field
                  label={`${t('form.email')}:`}
                  isRequired
                  name="email"
                  component={InputForm}
                  placeholder={t('form.email')}
                />
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
