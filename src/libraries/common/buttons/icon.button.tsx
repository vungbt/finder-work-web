'use client';
import { IconName, RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import React, { Ref, forwardRef } from 'react';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string;
  iconName?: IconName;
  classNameIcon?: string;
};

export const IconButton = forwardRef(function IconButton(
  props: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const { className, classNameIcon, iconName, ...reset } = props;

  return (
    <button
      className={clsx(className, 'block p-1')}
      type={reset.type ?? 'button'}
      {...reset}
      ref={ref}>
      <RenderIcon className={clsx('!w-5 !h-5', classNameIcon)} name={iconName} />
    </button>
  );
});
