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

import { IJobInformation } from '@/@views/user/company-profile/providers';
import useLanguage from '@/hooks/redux/language/useLanguage';
import { IOptItem } from '@/types';
import { InputForm, TextareaForm } from '../inputs';
import { SelectAsync } from '../selects';

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
  jobDescriptionGenerate: (values: IJDDescription, formData?: IJobInformation) => void;
  formikRef: React.RefObject<FormikProps<IJDDescription>>;
  formData?: IJobInformation;
  loading?: boolean;
};

export interface IJDDescription {
  platform: string;
  language: IOptItem;
  role: string;
  responsibility: string;
  qualification: string;
  benefit: string;
  tone: string;
  title: string;
}

const initialValues: IJDDescription = {
  platform: '',
  language: { label: '', value: '' },
  role: '',
  responsibility: '',
  qualification: '',
  benefit: '',
  tone: '',
  title: ''
};

export function ModalAiJobDescription({
  isOpen,
  onClose,
  jobDescriptionGenerate,
  formikRef,
  formData,
  loading
}: ModalWrapProps) {
  const t = useTranslations();
  const { options: languageOptions, loading: languageLoading, getLanguages } = useLanguage();

  const filterLanguage = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getLanguages({
      searchValue: searchValue,
      pagination: { limit: 20, page: 1 }
    });
    const options = (res?.all_language.data ?? []).map((item) => ({
      label: `${item.name} - ${item.locale}`,
      value: item.id
    }));
    return options;
  };
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
            <div className="mb-5 font-bold">{t('common.enterJDForm')}</div>
          </div>
          <Formik
            initialValues={initialValues}
            onSubmit={jobDescriptionGenerate}
            innerRef={formikRef}
          >
            {({ values }) => (
              <>
                <Field
                  label="Language "
                  isRequired
                  name="language"
                  component={SelectAsync}
                  loading={languageLoading}
                  filterOptions={filterLanguage}
                  defaultOptions={languageOptions}
                  placeholder={t('placeholder.select', {
                    label: 'language'
                  })}
                />
                <Field
                  label="Responsibility "
                  name="responsibility"
                  placeholder="Responsibility"
                  component={TextareaForm}
                />
                <Field
                  label="Qualification"
                  name="qualification"
                  placeholder="Qualification"
                  component={TextareaForm}
                />
                <Field
                  label="Benefit"
                  name="benefit"
                  placeholder="Benefit"
                  component={TextareaForm}
                />
                <Field label="Tone" name="tone" placeholder="Tone" required component={InputForm} />
                <Button
                  className=" min-w-56 !justify-center"
                  styleType={'success'}
                  label={t('common.aiGenerate')}
                  isLoading={loading}
                  onClick={() => {
                    if (jobDescriptionGenerate) {
                      jobDescriptionGenerate(values, formData);
                    }
                  }}
                />
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
