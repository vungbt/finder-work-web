import clsx from 'clsx';
import React from 'react';

type LineTextProps = {
  label: string;
  className?: string;
  classNameLabel?: string;
  classNameWrap?: string;
};
export function LineText({ label, className, classNameLabel, classNameWrap }: LineTextProps) {
  return (
    <div className={clsx('text-text-secondary text-center relative', classNameWrap)}>
      <p className={clsx('relative z-[1] bg-white w-fit mx-auto px-2', classNameLabel)}>{label}</p>
      <div
        className={clsx(
          'absolute top-1/2 left-1/2 right-0 h-[1px] bg-gray-100 transform -translate-x-1/2 -translate-y-1/2 z-0 w-5/6',
          className
        )}
      ></div>
    </div>
  );
}
