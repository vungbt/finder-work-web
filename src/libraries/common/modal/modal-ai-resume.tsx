import { IResumePersonalDetail } from '@/@views/user/resume/providers';
import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import { Field, Formik, FormikProps } from 'formik';
import {
  AnimatePresence,
  AnimationControls,
  motion,
  TargetAndTransition,
  VariantLabels,
  Variants
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import { Button } from '../buttons';
import { TextareaForm } from '../inputs';
import { resumeDescriptionForm } from '@/@handles/open-ai';

const modalAnimation = {
  hidden: { y: '-100vh', opacity: 0, scale: 0.8 },
  visible: {
    y: '0',
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, type: 'spring', damping: 20, stiffness: 300 }
  },
  exit: { y: '100vh', opacity: 0, scale: 0.8 }
};

const backdropAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export type ModalWrapProps = {
  isOpen: boolean;
  onClose?: () => void;
  resumeKeyWords: string[];
  onGenerate?: () => void;
  resumeDescriptionGenerate?: (values: IResumePersonalDetail, keywords: string) => void;
  personalDetails: IResumePersonalDetail;
  resumeDescription: string;
  formikRef: React.RefObject<FormikProps<resumeDescriptionForm>>;
  approveDescription: () => void;
};

export function ModalAiResume({
  isOpen,
  onClose,
  resumeKeyWords,
  resumeDescriptionGenerate,
  personalDetails,
  resumeDescription,
  formikRef,
  approveDescription
}: ModalWrapProps) {
  const t = useTranslations();

  return (
    <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
      <BackdropUpload
        className={clsx('classNameBackdrop', { hidden: !isOpen, block: isOpen })}
        onClick={onClose}
        variants={backdropAnimation}
        initial={isOpen ? 'visible' : 'hidden'}
        animate={isOpen ? 'visible' : 'hidden'}
        exit="exit"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            'modal bg-white shadow-2xl rounded-lg flex flex-col justify-center items-center',
            'className'
          )}
          variants={modalAnimation}
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
          exit="exit"
        >
          <div className="w-full flex justify-end pb-1">
            <button onClick={onClose}>
              <RenderIcon className="!w-5 !h-5 text-text-secondary" name="close" />
            </button>
          </div>
          <div className="w-full flex flex-col justify-start">
            <div className="mb-5 font-bold">{t('common.chooseYourResume')}</div>
          </div>
          <Formik
            innerRef={formikRef}
            initialValues={{ description: '' }}
            onSubmit={() => {
              formikRef.current?.setFieldValue('description', resumeDescription);
            }}
          >
            {({ setFieldValue, values }) => (
              <>
                <Field
                  label="Description"
                  isRequired
                  name="description"
                  component={TextareaForm}
                  placeholder={t('placeholder.enter', {
                    label: 'description'
                  })}
                />

                <div className="mt-10 grid grid-cols-5 gap-5">
                  {resumeKeyWords.map((item) => (
                    <>
                      <button
                        key={item}
                        onClick={() => handleKeywordClick(item, setFieldValue, values.description)}
                      >
                        {item}
                      </button>
                    </>
                  ))}
                </div>
                <div className="flex justify-center mt-5 gap-10">
                  <Button
                    className=" min-w-56 !justify-center"
                    styleType={'neon'}
                    label={t('common.aiGenerate')}
                    onClick={() => {
                      if (resumeDescriptionGenerate) {
                        resumeDescriptionGenerate(personalDetails, values.description);
                      }
                    }}
                  />
                  {resumeDescription.length > 0 && (
                    <Button
                      className=" min-w-56 !justify-center"
                      styleType={'success'}
                      label={t('common.useThisDescription')}
                      onClick={approveDescription}
                    />
                  )}
                </div>
              </>
            )}
          </Formik>
        </motion.div>
      </BackdropUpload>
    </AnimatePresence>
  );
}

export const BackdropUpload = ({
  children,
  onClick,
  className,
  variants,
  exit,
  initial,
  animate
}: {
  variants?: Variants;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  exit?: VariantLabels | TargetAndTransition;
  initial?: boolean | VariantLabels;
  animate?: boolean | VariantLabels | AnimationControls | TargetAndTransition;
}) => (
  <motion.div
    onClick={onClick}
    variants={variants}
    initial={initial}
    animate={animate}
    exit={exit}
    className={clsx(
      'modal-backdrop fixed inset-0 h-full w-full flex items-center justify-center bg-black bg-opacity-50 z-[9999]',
      className
    )}
  >
    {children}
  </motion.div>
);

const handleKeywordClick = (
  keyword: string,
  setFieldValue: (field: string, value: string) => void,
  currentDescription: string
) => {
  const keywordsArray = currentDescription ? currentDescription.split(', ') : [];
  if (!keywordsArray.includes(keyword)) {
    keywordsArray.push(keyword);
  }
  const newDescription = keywordsArray.join(', ');
  setFieldValue('description', newDescription);
};
