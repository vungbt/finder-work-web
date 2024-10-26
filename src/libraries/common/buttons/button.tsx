'use client';
import { IconName } from '@/libraries/icons';
import clsx from 'clsx';
import React, { Ref, forwardRef } from 'react';
import { IconViewSize } from '..';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  isLoading?: boolean;

  styleType?: 'default' | 'neon' | 'danger' | 'info' | 'success';
  buttonType?: 'default' | 'outline';
  minWidth?: 'full' | 'fit';
  size?: 'large' | 'middle' | 'small';
};

export const Button = forwardRef(function ButtonBase(
  props: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const {
    className,
    label,
    iconLeft,
    iconRight,
    isLoading,
    styleType = 'default',
    buttonType = 'default',
    minWidth = 'fit',
    size = 'large',
    disabled,
    ...reset
  } = props;
  const isDisabled = disabled ?? isLoading;

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        'flex items-center gap-2 transition-all ease-linear',
        {
          'box-border max-h-10 border-1.5 border-solid border-gray-100 bg-white text-dark hover:bg-secondary':
            styleType === 'default' && buttonType === 'default',
          'bg-neon text-white': styleType === 'neon' && buttonType === 'default',
          'bg-danger text-white': styleType === 'danger' && buttonType === 'default',
          'bg-success text-white': styleType === 'success' && buttonType === 'default',
          'bg-info text-white': styleType === 'info' && buttonType === 'default',

          'border-1.5 border-danger text-dark': styleType === 'danger' && buttonType === 'outline',
          'border-1.5 border-info text-dark': styleType === 'info' && buttonType === 'outline',

          // size
          'rounded-3xl px-4 py-2 text-base font-semibold': size === 'large',
          'rounded-2xl px-4 py-1.5 text-sm font-medium': size === 'middle',
          'rounded-xl px-2 py-0.5 text-sm font-medium': size === 'small',

          'cursor-no-drop opacity-90': isDisabled,

          'justify-center gap-2 w-full': minWidth === 'full',
          'justify-between min-w-fit': minWidth === 'fit'
        },
        className
      )}
      type={reset.type ?? 'button'}
      {...reset}
      ref={ref}>
      {iconLeft && (
        <IconViewSize
          className={clsx({
            '!h-5 !w-5': size === 'large',
            '!h-4.5 !w-4.5': size === 'middle',
            '!h-4 !w-4': size === 'small'
          })}
          name={iconLeft}
          isLoading={isLoading && !iconRight}
          size={size}
        />
      )}
      {label}

      {(iconRight || isLoading) && (
        <IconViewSize
          className={clsx({
            '!h-5 !w-5': size === 'large',
            '!h-4.5 !w-4.5': size === 'middle',
            '!h-4 !w-4': size === 'small'
          })}
          name={iconRight}
          isLoading={isLoading && !iconLeft}
          size={size}
        />
      )}
    </button>
  );
});
