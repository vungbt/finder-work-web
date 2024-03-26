import { toastSuccess } from '@/configs/toast';
import { BackButton, Button, InputForm } from '@/libraries/common';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import * as Yup from 'yup';
import { useForgotPasswordEmployee } from '../providers';

export default function ForgotPasswordEmployeeStepOne() {
  const t = useTranslations();
  const {
    actions,
    state: { formData }
  } = useForgotPasswordEmployee();

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(t('validation.required', { label: t('form.email').toLowerCase() }))
      .trim()
      .email(t('validation.valid', { label: t('form.email').toLowerCase() }))
  });

  const initialValues = {
    email: formData.email ?? ''
  };

  const onHandleSubmit = async (values: { email: string }) => {
    // TODO: CALL API HERE
    toastSuccess('Pls check email to get code.');
    setTimeout(() => {
      actions.nextStep({ ...formData, email: values.email });
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
      <h1 className="text-3xl font-bold mt-4">{t('common.forgotPassword')}</h1>
      <p className="mt-4 mb-10 text-text-secondary">{t('subTitle.forgotPassword')}</p>

      {/** form content */}
      <Formik<{ email: string }>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onHandleSubmit}>
        {() => {
          return (
            <Form>
              <Field
                label={`${t('form.email')}:`}
                isRequired
                name="email"
                component={InputForm}
                placeholder={t('form.email')}
              />
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
