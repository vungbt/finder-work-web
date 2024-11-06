import { RouterPath } from '@/constants/router-path';
import { Button, InputForm, InputPasswordForm, Logo, Steps } from '@/libraries/common';
import { RegexHelper } from '@/utils/helpers/regex';
import { Link } from '@/utils/navigation';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';
import { IEmployerRegister, useSignUpEmployer } from '../providers';

export default function SignUpEmployerStepOne() {
  const t = useTranslations();
  const {
    actions,
    state: { stepIndex, formData }
  } = useSignUpEmployer();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(t('validation.required', { label: t('form.email').toLowerCase() }))
      .trim()
      .email(t('validation.valid', { label: t('form.email').toLowerCase() })),
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
      .oneOf([Yup.ref('password')], t('validation.passwordMustMatch'))
  });

  const initialValues = {
    email: formData.email ?? '',
    password: formData?.password ?? '',
    confirmPassword: formData?.confirmPassword ?? ''
  };

  // submit register new account
  const onHandleSubmit = async (values: IEmployerRegister) => {
    try {
      // if (loading) return;
      // setLoading(true);
      // const res = await apiClient.authEmployeeRegister({ ...values });
      // setLoading(false);
      // const result = res?.auth_employee_register;
      // if (result.id) {
      //   toastSuccess(t('noti.registerSuccess'));
      //   actions.nextStep(values);
      //   actions.setUserTemp(result as UserOnly);
      // }
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
      <Link href={RouterPath.Home}>
        <Logo />
      </Link>
      <h1 className="text-3xl font-bold mt-4">{t('common.registerAs', { role: t('employer') })}</h1>

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
                  label={`${t('form.email')}:`}
                  isRequired
                  name="email"
                  component={InputForm}
                  placeholder={t('form.email')}
                />

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
