import React, { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    y: '100vh',
    opacity: 0
  }
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
      {isOpen && (
        <Backdrop className={classNameBackdrop} onClick={onClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className={clsx('modal bg-white sha shadow-2xl', className)}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit">
            {children}
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

export const Backdrop = ({
  children,
  onClick,
  className
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        'modal-backdrop fixed top-0 right-0 left-0 bottom-0 h-full w-full flex items-center justify-center z-[9999]',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      {children}
    </motion.div>
  );
};
