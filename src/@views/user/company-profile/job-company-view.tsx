'use client';
import { motion } from 'framer-motion';
import { CreateResume } from './providers';

export function JobView() {
  const {
    state: { steps, stepIndex }
  } = CreateResume();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      className="flex-1 flex flex-col justify-start pt-14 lg:pt-0"
    >
      <div className="flex-1 flex justify-start bg-text-primary lg:justify-center rounded-2xl">
        <motion.div
          animate="animate"
          initial="initial"
          exit="exit"
          custom={stepIndex > 0 && stepIndex < steps.length}
          className="flex-1 flex flex-col pt-14 lg:pt-0 w-full justify-center items-center"
        >
          {/** Step Content */}
          {steps[stepIndex].component}
        </motion.div>
      </div>
    </motion.div>
  );
}
