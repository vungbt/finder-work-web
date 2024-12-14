import { Steps } from '@/libraries/common';
import React from 'react';
import { useResume } from '../providers';

export default function StepsView() {
  const {
    actions,
    state: { stepIndex, totalStep }
  } = useResume();

  return (
    <div>
      {/** step active */}
      <Steps
        steps={totalStep}
        active={stepIndex}
        onChangeStep={(stepActive) => actions.changeStep(stepActive)}
      />
    </div>
  );
}
