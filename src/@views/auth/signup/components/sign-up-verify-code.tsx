import { BackButton, Button, InputForm, Steps } from '@/libraries/common';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import * as Yup from 'yup';
import { useSignUpEmployee } from '../providers';

export default function SignUpVerifyCode() {
  const {
    actions,
    state: { stepIndex, formData }
  } = useSignUpEmployee();
  const t = useTranslations();

  const validationSchema = Yup.object({
    verificationCode: Yup.string().required(
      t('validation.required', { label: t('form.verificationCode').toLowerCase() })
    )
  });

  const initialValues = {
    verificationCode: ''
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
      <h1 className="text-[32px] leading-[48px] font-semibold my-4">
        {t('common.emailVerification')}
      </h1>
      <p className="text-base text-text-secondary">
        {t('common.plsEnterTheSixDigitVerificationCode', { email: 'vungbt1999@gmail.com' })}
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
        onSubmit={onSubmitVerifyCode}>
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
                label={t('common.submit')}
              />
            </Form>
          );
        }}
      </Formik>
    </motion.div>
  );
}
