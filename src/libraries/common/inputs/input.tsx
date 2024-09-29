/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconName } from '@/libraries/icons';
import clsx from 'clsx';
import { FieldInputProps, FormikProps } from 'formik';
import { Ref, forwardRef } from 'react';
import { FormGroup, IconViewSize } from '..';

type InputProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'size'
> & {
  field?: FieldInputProps<never>;
  form?: FormikProps<any>;
  label?: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  isLoading?: boolean;
  isRequired?: boolean;
  classNameWrap?: string;

  error?: string;
  size?: 'large' | 'middle' | 'small';
  layout?: 'horizontal' | 'vertical';
};

export const InputForm = forwardRef(function Input(props: InputProps, ref: Ref<HTMLInputElement>) {
  const {
    className,
    classNameWrap,
    size = 'large',
    field,
    form,
    iconLeft,
    iconRight,
    layout,
    isLoading,
    isRequired,
    disabled,
    label,
    onChange,
    ...reset
  } = props;
  const name = field?.name;
  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];

  return (
    <FormGroup size={size} layout={layout} label={label} name={name} isRequired={isRequired}>
      <label
        htmlFor={name}
        className={clsx(
          'input-custom box-border flex w-full items-center border border-solid transition-all ease-linear hover:border-info',
          {
            'min-h-10 gap-3 rounded-3xl px-4 text-base': size === 'large',
            'min-h-8 gap-2 rounded-2xl px-4 text-sm': size === 'middle',
            'min-h-6 gap-1 rounded-xl px-2 text-sm': size === 'small',

            '!border-danger': isHaveError,
            'border-gray-100': !isHaveError,
            'cursor-not-allowed !bg-gray-100': disabled
          },
          classNameWrap
        )}
      >
        {iconLeft && (
          <IconViewSize className="icon-left" name={iconLeft} isLoading={isLoading} size={size} />
        )}
        <input
          ref={ref}
          name={name}
          id={name}
          value={field?.value}
          onChange={(e) => {
            if (disabled) return;
            if (onChange) {
              onChange(e);
            }
            field?.onChange(e);
          }}
          onBlur={field?.onBlur}
          disabled={disabled}
          className={clsx(
            'w-full flex-1 border-none text-dark outline-none bg-transparent',
            { 'cursor-not-allowed bg-gray-100': disabled },
            className
          )}
          {...reset}
        />
        {(iconRight || isLoading) && (
          <IconViewSize
            className={clsx('icon-right', {
              '!text-text-tertiary': disabled
            })}
            name={iconRight}
            isLoading={isLoading}
            size={size}
          />
        )}
      </label>
    </FormGroup>
  );
});
