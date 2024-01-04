'use client';
import { IconName, RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import React, { Ref, forwardRef } from 'react';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  loading?: boolean;

  styleType?: 'default' | 'neon' | 'danger' | 'info';
  buttonType?: 'default' | 'outline';
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
    loading,
    styleType = 'default',
    buttonType = 'default',
    size = 'large',
    disabled,
    ...reset
  } = props;
  const isDisabled = disabled ?? loading;

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        'flex min-w-fit items-center justify-between gap-2 rounded-3xl transition-all',
        {
          'box-border max-h-10 border-1.5 border-solid border-gray-100 bg-white text-dark':
            styleType === 'default' && buttonType === 'default',
          'bg-neon text-white': styleType === 'neon' && buttonType === 'default',
          'bg-danger text-white': styleType === 'danger' && buttonType === 'default',
          'bg-info text-white': styleType === 'info' && buttonType === 'default',

          'border-1.5 border-danger text-dark': styleType === 'danger' && buttonType === 'outline',
          'border-1.5 border-info text-dark': styleType === 'info' && buttonType === 'outline',

          // size
          'px-4 py-2 text-base font-semibold': size === 'large',
          'px-4 py-2 text-sm font-medium': size === 'middle',
          'px-2 py-1 text-sm font-medium': size === 'small',

          'cursor-no-drop opacity-90': isDisabled
        },
        className
      )}
      {...reset}
      ref={ref}>
      {iconLeft && (
        <RenderIcon
          className={clsx({
            '!h-5 !w-5': size === 'large',
            '!h-4.5 !w-4.5': size === 'middle',
            '!h-4 !w-4': size === 'small'
          })}
          name={loading ? 'loading' : iconLeft}
        />
      )}
      {label}
      {iconRight && (
        <RenderIcon
          className={clsx({
            '!h-5 !w-5': size === 'large',
            '!h-4.5 !w-4.5': size === 'middle',
            '!h-4 !w-4': size === 'small'
          })}
          name={loading ? 'loading' : iconRight}
        />
      )}
    </button>
  );
});
