'use client';
import { ResumeUtils } from '@/@handles/resume/resume.utils';
import { Button, Steps } from '@/libraries/common';
import { ResumeCard } from '@/libraries/common/cards/resume.card';
import { ModalUpload } from '@/libraries/common/modal/model-upload';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useResume } from '../providers/resume-providers';

export default function PersonalDetail() {
  const t = useTranslations();
  const {
    actions,
    state: { formData, stepIndex, totalStep }
  } = useResume();

  const {
    data: myResume,
    isOpenUpload,
    openUpload,
    oncloseUpload,
    onSubmitResumeFile
  } = ResumeUtils();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      className="mx-auto pb-10 w-3/4"
    >
      <div className="mt-5">
        <Steps
          steps={totalStep}
          active={stepIndex}
          onChangeStep={(stepActive) => actions.changeStep(stepActive)}
        />
      </div>
      <h1 className="text-3xl font-bold mt-4"> RESUME</h1>

      <div className="flex flex-1 gap-6">
        <Button
          className="mt-10"
          minWidth="fit"
          onClick={() => actions.nextStep({ ...formData })}
          styleType="info"
          label={t('common.create')}
        />
        <Button
          className="mt-10"
          minWidth="fit"
          onClick={openUpload}
          styleType="neon"
          label={t('common.upload')}
        />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-5">
        {myResume.map((item) => (
          <div key={item.id} className="my-5 ">
            <ResumeCard item={item} key={item.id} />
          </div>
        ))}
      </div>

      <ModalUpload
        isOpen={isOpenUpload}
        onClose={oncloseUpload}
        onSubmit={onSubmitResumeFile}
        header={t('common.uploadResume')}
      />
    </motion.div>
  );
}
