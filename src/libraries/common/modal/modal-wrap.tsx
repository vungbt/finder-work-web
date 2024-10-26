import React, { ReactNode } from 'react';
import {
  AnimatePresence,
  AnimationControls,
  motion,
  TargetAndTransition,
  VariantLabels,
  Variants
} from 'framer-motion';
import clsx from 'clsx';

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
  children: ReactNode;
  className?: string;
  classNameBackdrop?: string;
};

export function ModalWrap({
  onClose,
  isOpen,
  children,
  className,
  classNameBackdrop
}: ModalWrapProps) {
  return (
    <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
      <Backdrop
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
          className={clsx('modal bg-white shadow-2xl rounded-lg', className)}
          variants={modalAnimation}
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
          exit="exit"
        >
          {children}
        </motion.div>
      </Backdrop>
    </AnimatePresence>
  );
}

export const Backdrop = ({
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
