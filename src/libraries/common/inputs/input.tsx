/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldInputProps, FormikProps } from 'formik';
import { Ref, forwardRef } from 'react';
import { FormGroup } from '..';
import clsx from 'clsx';
import { IconName, RenderIcon } from '@/libraries/icons';

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

  error?: string;
  loading?: boolean;
  size?: 'large' | 'middle' | 'small';
  layout?: 'horizontal' | 'vertical';
};

export const InputForm = forwardRef(function Input(props: InputProps, ref: Ref<HTMLInputElement>) {
  const {
    className,
    size = 'large',
    field,
    form,
    iconLeft,
    iconRight,
    layout,
    isLoading,
    isRequired,
    label,
    ...reset
  } = props;
  const name = field?.name;
  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];

  return (
    <FormGroup layout={layout} label={label} name={name} isRequired={isRequired}>
      <label
        htmlFor={name}
        className={clsx(
          'box-border flex w-full items-center border border-solid transition-all ease-linear hover:border-info',
          {
            'min-h-10 gap-3 rounded-3xl px-4 text-base': size === 'large',
            'min-h-8 gap-2 rounded-2xl px-4 text-sm': size === 'middle',
            'min-h-6 gap-1 rounded-xl px-2 text-sm': size === 'small',

            '!border-danger': isHaveError,
            'border-gray-100': !isHaveError
          }
        )}
      >
        {iconLeft && <IconView name={iconLeft} isLoading={isLoading} size={size} />}
        <input
          ref={ref}
          name={name}
          id={name}
          value={field?.value}
          onChange={field?.onChange}
          onBlur={field?.onBlur}
          className={clsx('flex-1 border-none text-dark outline-none', className)}
          {...reset}
        />
        {(iconRight || isLoading) && (
          <IconView name={iconRight} isLoading={isLoading} size={size} />
        )}
      </label>
    </FormGroup>
  );
});

const IconView = ({
  name,
  isLoading,
  size
}: {
  name?: IconName;
  isLoading?: boolean;
  size: 'large' | 'middle' | 'small';
}) => {
  return (
    <RenderIcon
      className={clsx({
        '!h-5 !w-5': size === 'large',
        '!h-4.5 !w-4.5': size === 'middle',
        '!h-4 !w-4': size === 'small'
      })}
      name={isLoading ? 'loading' : name}
    />
  );
};
