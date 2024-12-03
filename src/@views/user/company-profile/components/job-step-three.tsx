import { BackButton, Button, DatePicker, InputForm, Steps } from '@/libraries/common';
import { Field, FieldArray, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { CreateResume, ICreateResumeDataForm, IEducation } from '../providers';
import { Collapse } from '../../../../libraries/common/collapse/collapse';
import CompanyProfile from '@/app/[locale]/(withAuth)/portal/@employer/company/profile/page';

type WorkExperienceSectionProps = {
  education: IEducation;
  index: number;
  remove: (index: number) => void;
};

export default function CreateResumeStepOne() {
  const t = useTranslations();

  const {
    actions,
    state: { stepIndex, formData }
  } = CreateResume();

  const onHandleSubmit = async () => {
    actions.nextStep(formData);
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
        excludeSteps={[3]}
        className="my-10"
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />

      <div>
        <CompanyProfile />
      </div>
      <div className="flex flex-1 justify-between my-10">
        <BackButton onClick={() => actions.previousStep(formData)} />
        <Button onClick={onHandleSubmit} styleType="info" label={t('common.next')} />
      </div>
    </motion.div>
  );
}
