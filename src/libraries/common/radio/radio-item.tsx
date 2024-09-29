import clsx from 'clsx';
import React, { ReactNode, Ref, forwardRef } from 'react';

type RadioItemProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'size'
> & {
  label?: string | ReactNode;
  isHaveError?: boolean;
  size?: 'large' | 'middle' | 'small';
  styleType?: 'default' | 'danger' | 'info';
};

export const RadioItem = forwardRef(function RadioItem(
  props: RadioItemProps,
  ref: Ref<HTMLInputElement>
) {
  const { className, label, isHaveError, size, styleType, ...reset } = props;
  return (
    <label className={clsx('radio-custom', className)}>
      <input hidden className="radio-custom__input" ref={ref} type="radio" {...reset} />
      <span
        className={clsx('radio-custom__checkmark', {
          'radio-custom__checkmark__small': size === 'small',
          'radio-custom__checkmark__middle': size === 'middle',
          'radio-custom__checkmark__large': size === 'large',

          'radio-custom__checkmark-default': styleType === 'default',
          'radio-custom__checkmark-danger': styleType === 'danger',
          'radio-custom__checkmark-info': styleType === 'info',

          'radio-custom__error': isHaveError
        })}
      ></span>
      <span>{label}</span>
    </label>
  );
});
