import React, { ReactNode, useMemo } from 'react';
import {
  AnimatePresence,
  AnimationControls,
  motion,
  TargetAndTransition,
  VariantLabels,
  Variants
} from 'framer-motion';
import clsx from 'clsx';
import { Upload, UploadItem } from '../upload';
import { Formik, Form } from 'formik';
import { IconName, RenderIcon } from '@/libraries/icons';
import { useTranslations } from 'next-intl';

import { Button } from '../buttons';
const modalAnimation = {
  hidden: {
    y: '-100vh',
    opacity: 0,
    scale: 0.8
  },
  visible: {
    y: '0',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  },
  exit: {
    y: '100vh',
    opacity: 0,
    scale: 0.8
  }
};

const backdropAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export type ModalWrapProps = {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  classNameBackdrop?: string;
  onSubmit: (values: UploadItem) => void;
  onCancel?: () => void;
  cancelLabel?: string;
  cancelIcon?: IconName;
  classNameCancel?: string;

  submitLabel?: string;
  submitIcon?: IconName;
  isLoading?: boolean;
  classNameSubmit?: string;

  message?: string;
  warning?: string;

  actions?: ReactNode;
  iconMain?: IconName;
  header: string;
};

export function ModalUpload({
  onSubmit,
  onClose,
  className,
  classNameBackdrop,
  cancelIcon,
  cancelLabel,
  classNameCancel,
  submitIcon,
  submitLabel,
  classNameSubmit,
  actions,
  isLoading,
  isOpen,
  header
}: ModalWrapProps) {
  const t = useTranslations();

  const renderActions = useMemo(() => {
    if (actions) return actions;
    return (
      <div className="flex justify-center items-center gap-3 mt-5">
        <Button
          onClick={onClose}
          label={cancelLabel ?? t('noCancel')}
          iconLeft={cancelIcon}
          size="middle"
          className={classNameCancel}
        />
        <Button
          label={submitLabel ?? t('common.upload')}
          iconLeft={submitIcon ?? 'add'}
          className={clsx(classNameSubmit)}
          styleType="neon"
          type="submit"
          size="middle"
          isLoading={isLoading}
        />
      </div>
    );
  }, [
    onClose,
    actions,
    t,
    isLoading,
    cancelIcon,
    cancelLabel,
    submitIcon,
    submitLabel,
    classNameCancel,
    classNameSubmit
  ]);

  const initialValues: UploadItem = {
    file: null
  };

  return (
    <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
      <BackdropUpload
        className={clsx(classNameBackdrop, {
          hidden: !isOpen,
          block: isOpen
        })}
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
            className
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
            <div className="mb-5 font-bold">{header}</div>
          </div>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ setFieldValue, errors, setErrors, values }) => {
              return (
                <Form>
                  <div className="flex justify-center items-center">
                    <Upload
                      isRequired={true}
                      label="File upload"
                      name="file"
                      typeAccept="application/pdf"
                      placeholder="Drop or Drag a File"
                      subPlaceholder="PDF"
                      onChange={(value) => {
                        setFieldValue('file', value);
                        console.log(123, value?.file?.name);
                      }}
                      fileName={values.file?.name}
                      error={errors?.file}
                      setError={(mess) => setErrors(mess)}
                    />
                  </div>
                  {values.file && (
                    <div className="mt-2 text-center">
                      <span> {values.file.file.name}</span>
                    </div>
                  )}
                  {renderActions}
                </Form>
              );
            }}
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
}) => {
  return (
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
};
