'use client';
import { UserRole } from '@/configs/graphql/generated';
import { toastError } from '@/configs/toast';
import { RouterPath } from '@/constants/router-path';
import { Button, InputForm, InputPasswordForm, Logo } from '@/libraries/common';
import { IAuthLogin } from '@/types';
import { RegexHelper } from '@/utils/helpers/regex';
import { Link, useRouter } from '@/utils/navigation';
import { Field, Form, Formik } from 'formik';
import { StatusCodes } from 'http-status-codes';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import * as Yup from 'yup';

export default function AdminLoginView() {
  const t = useTranslations();
  const router = useRouter();

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

  const handleSubmit = async (values: IAuthLogin) => {
    const res = await signIn('credentials', {
      ...values,
      role: UserRole.Admin,
      callbackUrl: RouterPath.PORTAL_ADMIN,
      redirect: false
    });
    const errors = res?.error;
    if (errors && res?.status !== StatusCodes.OK) {
      const errorData = JSON.parse(errors);
      if (errorData?.statusCode === StatusCodes.UNAUTHORIZED) {
        toastError(errorData.message);
      }
    }
    if (!errors && res?.status === StatusCodes.OK) {
      router.push(RouterPath.PORTAL_ADMIN);
    }
  };
  return (
    <section className="w-full h-screen flex items-center p-5 flex-col bg-gray-200">
      <div className="flex w-full justify-center items-center mt-14 gap-5">
        <Link href={RouterPath.Home}>
          <Logo />
        </Link>
        <h3 className="text-3xl font-bold">{t('common.management')}</h3>
      </div>
      <div className="bg-white rounded-2xl shadow-xl py-6 px-10 mt-14 min-w-[423px]">
        <p className="font-bold text-2xl text-center mb-10">{t('common.adminLogin')}</p>

        {/** form content */}
        <Formik<IAuthLogin>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
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
                    component={InputPasswordForm}
                    placeholder={t('form.password')}
                  />
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
      </div>
    </section>
  );
}
