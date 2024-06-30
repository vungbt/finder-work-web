import clsx from 'clsx';
import React, { useMemo } from 'react';

type StepsProps = {
  steps: number;
  active: number;
  excludeSteps?: number[];
  className?: string;
  onChangeStep?: (step: number) => void;
};

export function Steps({ steps, active, excludeSteps, className, onChangeStep }: StepsProps) {
  const items = useMemo(() => {
    const array = Array.from(Array(steps).keys());
    return array ?? [];
  }, [steps]);

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      {items &&
        items.length > 0 &&
        items.map((_, index) => (
          <span
            onClick={() => onChangeStep && onChangeStep(index)}
            className={clsx('inline-block h-2 rounded-2xl transition-all ease-linear flex-1', {
              'bg-info': index <= active,
              'bg-gray-100': index > active,
              'cursor-pointer': onChangeStep && index <= active,
              hidden: excludeSteps && excludeSteps.includes(index)
            })}
            key={index}
            id={`step-${index}`}
          ></span>
        ))}
    </div>
  );
}
