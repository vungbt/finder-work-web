import { Job, Resume } from '@/configs/graphql/generated';
import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import {
  AnimatePresence,
  AnimationControls,
  motion,
  TargetAndTransition,
  VariantLabels,
  Variants
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ReactNode } from 'react';
import { Button } from '../buttons';
import { IconViewSize } from '../form';
import { ModalConfirm } from './modal-confirm';

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
  resume: Resume[];
  job: Job;
  onApplyJob: (item: Resume, job: Job) => void;
  isLoading?: boolean;
  resumeApply?: Resume;
  confirmApplyJob: () => void;
  onCloseConfirmApply: () => void;
};

export function ModalApplyResume({
  isOpen,
  onClose,
  resume,
  onApplyJob,
  job,
  isLoading,
  resumeApply,
  confirmApplyJob,
  onCloseConfirmApply
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
          {isLoading ? (
            <IconViewSize className={clsx({})} isLoading={isLoading} size="middle" /> // Render the spinner when loading
          ) : (
            <div className="mt-10 grid grid-cols-4 gap-5">
              {resume.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-1 h-full w-full p-4 gap-3 relative z-[1] rounded-2xl shadow-md bg-gray-200"
                >
                  <div className="my-5">
                    <div className="flex gap-3 flex-1">
                      <Image
                        width={120}
                        height={120}
                        alt="resume-card"
                        src={item.thumbnail?.url || ''}
                        className="rounded-s"
                      />
                      <div className="flex flex-col justify-between">
                        <h3 className="text-lg font-bold my-2">
                          {t('name')}:{item.name}
                        </h3>
                        <Button
                          className="w-full !justify-center"
                          styleType="neon"
                          type="submit"
                          label="Choose"
                          onClick={() => onApplyJob(item, job)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <ModalConfirm
                message={t('noti.confirmApplyJob')}
                isOpen={!!resumeApply}
                isLoading={isLoading}
                submitIcon={'add'}
                onClose={onCloseConfirmApply}
                onCancel={onCloseConfirmApply}
                onSubmit={confirmApplyJob}
                submitType={'neon'}
                iconMain={'import-icon'}
              />
            </div>
          )}
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
