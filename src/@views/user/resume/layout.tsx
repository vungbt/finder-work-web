'use client';
import { motion } from 'framer-motion';
import { useResume } from './providers';

export function CreateResumeView() {
  const {
    state: { steps, stepIndex }
  } = useResume();
  console.log('CreateResumeView', steps, stepIndex);

  return (
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
  );
}
