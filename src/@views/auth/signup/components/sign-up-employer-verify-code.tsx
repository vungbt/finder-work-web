import { BackButton, Button, InputForm, Steps } from '@/libraries/common';
import { useApiClient } from '@/libraries/providers/graphql';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';
import { useSignUpEmployer } from '../providers';

export default function SignUpEmployerVerifyCode() {
  const {
    actions,
    state: { stepIndex, formData, userTemp }
  } = useSignUpEmployer();
  const t = useTranslations();
  const { apiClient } = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    verificationCode: Yup.string().required(
      t('validation.required', { label: t('form.verificationCode').toLowerCase() })
    )
  });

  const initialValues = {
    verificationCode: ''
  };

  const onSubmitVerifyCode = async (values: { verificationCode: string }) => {
    try {
      if (loading || !userTemp?.id) return;
      setLoading(true);
      const res = await apiClient.authVerifyAccount({
        verifyCode: values.verificationCode,
        userId: userTemp?.id
      });
      setLoading(false);
      const result = res.auth_verify_account;
      if (result.id) {
        actions.nextStep({ ...formData, verifyCode: Number(values.verificationCode) });
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
      <h1 className="text-[32px] leading-[48px] font-semibold my-4">
        {t('common.emailVerification')}
      </h1>
      <p className="text-base text-text-secondary">
        {t('common.plsEnterTheSixDigitVerificationCode', { email: formData?.email })}
      </p>
      {/** step active */}
      <Steps
        className="my-10"
        steps={4}
        active={stepIndex}
        excludeSteps={[0]}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />

      {/** form code verify */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitVerifyCode}
      >
        {() => {
          return (
            <Form>
              <Field
                label={`${t('form.verificationCode')}:`}
                isRequired
                name="verificationCode"
                component={InputForm}
                placeholder={t('placeholder.enter', { label: t('common.code').toLowerCase() })}
              />

              <div className="flex items-center justify-between">
                <div />
                <Button buttonType="outline" label={t('common.resendCode')} />
              </div>
              <Button
                className="mt-10"
                minWidth="full"
                type="submit"
                styleType="info"
                label={t('submit')}
                isLoading={loading}
              />
            </Form>
          );
        }}
      </Formik>
    </motion.div>
  );
}
