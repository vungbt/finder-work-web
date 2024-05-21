import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import React, { ReactNode, Ref, forwardRef } from 'react';

type CheckboxItemProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'size'
> & {
  label?: string | ReactNode;
  isHaveError?: boolean;
  size?: 'large' | 'middle' | 'small';
  styleType?: 'default' | 'danger' | 'info';
  indeterminate?: boolean;
};

export const CheckboxItem = forwardRef(function CheckboxItem(
  props: CheckboxItemProps,
  ref: Ref<HTMLInputElement>
) {
  const {
    className,
    label,
    isHaveError,
    checked,
    size = 'large',
    styleType = 'default',
    indeterminate,
    ...reset
  } = props;

  return (
    <label
      className={clsx(
        'checkbox-custom',
        {
          'checkbox-custom-indeterminate': indeterminate,
          'checkbox-custom-checked': !indeterminate && checked
        },
        className
      )}
    >
      <input
        checked={checked && !indeterminate}
        hidden
        className="checkbox-custom__input"
        ref={ref}
        type="checkbox"
        {...reset}
      />
      <span
        className={clsx('checkbox-custom__checkmark', {
          'checkbox-custom__checkmark__small': size === 'small',
          'checkbox-custom__checkmark__middle': size === 'middle',
          'checkbox-custom__checkmark__large': size === 'large',

          'checkbox-custom__checkmark-default': styleType === 'default',
          'checkbox-custom__checkmark-danger': styleType === 'danger',
          'checkbox-custom__checkmark-info': styleType === 'info',

          'checkbox-custom__error': isHaveError
        })}
      >
        <RenderIcon
          className={clsx('checkbox-custom__icon', {
            'checkbox-custom__icon__small': size === 'small',
            'checkbox-custom__icon__middle': size === 'middle',
            'checkbox-custom__icon__large': size === 'large'
          })}
          strokeWidth={size === 'large' ? 3 : 4}
          name="check-icon"
        />
      </span>
      <>{label}</>
    </label>
  );
});
