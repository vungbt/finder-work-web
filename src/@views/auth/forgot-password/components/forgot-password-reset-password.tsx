import { BackButton, Button, InputForm, InputPasswordForm } from '@/libraries/common';
import { RegexHelper } from '@/utils/helpers/regex';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import * as Yup from 'yup';
import { useForgotPasswordEmployee } from '../providers';

export default function ForgotPasswordResetPassword() {
  const {
    actions,
    state: { formData }
  } = useForgotPasswordEmployee();
  const t = useTranslations();

  const validationSchema = Yup.object({
    verificationCode: Yup.string().required(
      t('validation.required', { label: t('form.verificationCode').toLowerCase() })
    ),
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
    verificationCode: '',
    password: formData?.password ?? '',
    confirmPassword: formData?.confirmPassword ?? ''
  };

  const onSubmitVerifyCode = (values: { verificationCode: string }) => {
    // TODO: CALL API ACTIVE ACCOUNT
    setTimeout(() => {
      actions.nextStep({ ...formData, verifyCode: Number(values.verificationCode) });
    }, 1000);
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
      className="mx-auto">
      <BackButton onClick={() => actions.previousStep(formData)} />

      {/** header */}
      <h1 className="text-[32px] leading-[48px] font-semibold">{t('common.resetPassword')}</h1>
      <p className="mt-4 mb-10 text-base text-text-secondary">{t('subTitle.resetPassword')}</p>

      {/** form code verify */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitVerifyCode}>
        {() => {
          return (
            <Form>
              <div className="flex flex-col gap-6">
                <div>
                  <Field
                    label={`${t('form.verificationCode')}:`}
                    isRequired
                    name="verificationCode"
                    component={InputForm}
                    placeholder={t('placeholder.enter', { label: t('common.code').toLowerCase() })}
                  />

                  {/** resend code */}
                  <div className="flex items-center justify-between">
                    <div />
                    <Button buttonType="outline" label={t('common.resendCode')} />
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

              <Button
                className="mt-10"
                minWidth="full"
                type="submit"
                styleType="info"
                label={t('common.send')}
              />
            </Form>
          );
        }}
      </Formik>
    </motion.div>
  );
}
