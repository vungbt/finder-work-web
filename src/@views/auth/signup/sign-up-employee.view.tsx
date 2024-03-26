'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useSignUpEmployee } from './providers';

export function SignUpEmployeeView() {
  const {
    state: { steps, stepIndex }
  } = useSignUpEmployee();

  const variants = {
    initial: (next: boolean) => {
      return {
        x: next ? 100 : -100,
        opacity: 0
      };
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.1
      }
    },
    exit: (next: boolean) => {
      return {
        x: next ? -100 : 100,
        opacity: 0,
        transition: {
          duration: 0.1
        }
      };
    }
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
      className="flex-1 flex flex-col items-center relative py-5 md:pt-[5%] md:pb-10 overflow-auto">
      <AnimatePresence
        initial={false}
        mode="wait"
        custom={stepIndex > 0 && stepIndex < steps.length}>
        <motion.div
          variants={variants}
          animate="animate"
          initial="initial"
          exit="exit"
          custom={stepIndex > 0 && stepIndex < steps.length}
          className="w-[90%] sm:w-[80%] md:w-[500px] h-full">
          {/** Step Content */}
          {steps[stepIndex].component}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
