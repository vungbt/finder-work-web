import useCountries from '@/hooks/redux/countries/useCountries';
import { BackButton, Button, InputForm, SelectForm, Steps, TextareaForm } from '@/libraries/common';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { CreateResume, IPersonalDetail } from '../providers/create-resume.provider';

export default function CreateResumeStepOne() {
  const t = useTranslations();
  const {
    actions,
    state: { stepIndex, formData }
  } = CreateResume();

  const { options, defaultOption, countries } = useCountries();
  console.log(countries);

  const validationSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: any = {
      fullName: Yup.string().required(
        t('validation.required', { label: t('form.fullName').toLowerCase() })
      ),
      jobTitle: Yup.string().required(
        t('validation.required', { label: t('form.jobTitle').toLowerCase() })
      ),
      email: Yup.string()
        .email(t('validation.email', { label: t('form.email').toLowerCase() }))
        .required(t('validation.required', { label: t('form.email').toLowerCase() })),
      phoneCode: Yup.object().required(
        t('validation.required', { label: t('form.phoneCode').toLowerCase() })
      ),
      phoneNumber: Yup.string().required(
        t('validation.required', { label: t('form.phoneNumber').toLowerCase() })
      ),
      address: Yup.object().required(
        t('validation.required', { label: t('form.address').toLowerCase() })
      ),
      addressDetail: Yup.string().required(
        t('validation.required', { label: t('form.addressDetail').toLowerCase() })
      ),
      summary: Yup.string().required(
        t('validation.required', { label: t('form.summary').toLowerCase() })
      )
    };

    return Yup.object(schema);
  }, [t]);

  const initialValues = {
    fullName: formData.personalDetail.fullName ?? '',
    email: formData.personalDetail.email ?? '',
    phoneCode: formData.personalDetail.phoneCode ?? defaultOption,
    phoneNumber: formData.personalDetail.phoneNumber ?? '',
    address: formData.personalDetail.address ?? null,
    addressDetail: formData.personalDetail.addressDetail ?? '',
    summary: formData.personalDetail.summary ?? '',
    jobTitle: formData.personalDetail.jobTitle ?? ''
  };
  // submit register new account
  const onHandleSubmit = async (values: IPersonalDetail) => {
    console.log(values);
    actions.nextStep(formData);
    actions.setProfileTemp(values);
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
      className="w-3/4 ms-6"
    >
      {/** step active */}
      <Steps
        steps={5}
        excludeSteps={[1]}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />
      {/** form content */}
      <div>
        <Formik<IPersonalDetail>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onHandleSubmit}
        >
          {() => {
            return (
              <div className="w-full">
                <Form>
                  <div className="flex flex-1 gap-5">
                    <Field
                      label={`${t('form.fullName')}:`}
                      name="fullName"
                      component={InputForm}
                      placeholder={t('form.fullName')}
                    />
                    <Field
                      label={`${t('form.email')}:`}
                      name="email"
                      component={InputForm}
                      placeholder={t('form.email')}
                    />
                  </div>
                  {/** phone number */}
                  <div className="flex items-center flex-wrap gap-2">
                    <div className="w-fit min-w-40">
                      <Field
                        label={`${t('form.phoneCode')}:`}
                        name="phoneCode"
                        component={SelectForm}
                        placeholder={t('form.phoneCode')}
                        options={options}
                      />
                    </div>
                    <div className="flex-1">
                      <Field
                        label={`${t('form.phoneNumber')}:`}
                        name="phoneNumber"
                        component={InputForm}
                        placeholder={t('form.phoneNumber')}
                      />
                    </div>
                  </div>

                  <Field
                    label={`${t('form.jobTitle')}:`}
                    name="jobTitle"
                    component={InputForm}
                    placeholder={t('form.jobTitle')}
                  />
                  <Field
                    label={t('form.address')}
                    name="address"
                    placeholder={t('form.address')}
                    component={SelectForm}
                    options={countries.map((country) => ({
                      value: country.id,
                      label: country.name
                    }))}
                  />
                  <Field
                    label={`${t('form.addressDetail')}:`}
                    name="addressDetail"
                    component={InputForm}
                    placeholder={t('form.addressDetail')}
                  />

                  <Field
                    label={`${t('form.summary')}:`}
                    name="summary"
                    component={TextareaForm}
                    placeholder={t('form.summary')}
                  />

                  <div className="flex flex-1 justify-between my-10">
                    <BackButton onClick={() => actions.previousStep(formData)} />
                    <Button
                      className="w-fit min-w-48 !justify-center"
                      type="submit"
                      styleType="info"
                      label={t('common.next')}
                    />
                  </div>
                </Form>
              </div>
            );
          }}
        </Formik>
      </div>
    </motion.div>
  );
}
