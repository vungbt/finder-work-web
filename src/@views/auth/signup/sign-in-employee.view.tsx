'use client';
import { RouterPath } from '@/constants/router-path';
import { Button, GoogleLoginButton, InputForm, LineText, Logo } from '@/libraries/common';
import { IAuthLogin } from '@/types';
import { RegexHelper } from '@/utils/helpers/regex';
import { Link } from '@/utils/navigation';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import * as Yup from 'yup';

export function SignInEmployeeView() {
  const t = useTranslations();

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
      .matches(RegexHelper.REGEX_PASSWORD, t('validation.passwordInvalid'))
  });

  const initialValues = {
    email: '',
    password: ''
  };

  const handleSubmit = (values: IAuthLogin) => {
    // TODO: CALL API LOGIN
    console.log('Form values:', values);
    // setSubmitting(false);
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
      className="flex-1 flex flex-col justify-start pt-14 items-center lg:pt-0 lg:justify-center">
      <div className="w-[90%] sm:w-[80%] md:w-[500px] mx-auto">
        <Link href={RouterPath.Home}>
          <Logo />
        </Link>
        <h1 className="text-3xl font-bold mt-4">{t('common.loginAs', { role: t('jobSeeker') })}</h1>
        <p className="mt-4 mb-10 text-text-secondary">{t('signIn.subTitle')}</p>

        {/** form content */}
        <Formik<IAuthLogin>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {() => {
            return (
              <Form>
                <div className="flex flex-col gap-6">
                  <Field
                    label={`${t('form.email')}:`}
                    isRequired={true}
                    name="email"
                    component={InputForm}
                    placeholder={t('form.email')}
                  />
                  <Field
                    label={`${t('form.password')}:`}
                    isRequired={true}
                    name="password"
                    component={InputForm}
                    placeholder={t('form.password')}
                  />
                </div>

                <div className="flex items-center justify-end mt-2">
                  <Link
                    className="font-semibold text-info text-sm"
                    href={RouterPath.ForgotPassword}>
                    {t('form.forgotPassword')}
                  </Link>
                </div>

                <Button
                  className="mt-10"
                  minWidth="full"
                  type="submit"
                  styleType="info"
                  label={t('form.login')}
                />
              </Form>
            );
          }}
        </Formik>

        <div className="mt-6 flex flex-col gap-6">
          <LineText label={t('common.orLoginWith')} />

          {/** btn login with google */}
          <GoogleLoginButton />

          <div className="flex items-center justify-center gap-2">
            <p>{t('common.doNotHaveAnAccount')}</p>
            <Link href={RouterPath.SignUp} className="text-sm font-semibold">
              {t('common.registerHere')}
            </Link>
          </div>
        </div>
      </div>
      {/* <LeftContentSignAuth className="hidden w-1/2 flex-1 lg:block" /> */}
    </motion.div>
  );
}
