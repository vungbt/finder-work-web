/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconName, RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import { FieldInputProps, FormikProps } from 'formik';
import { Ref, forwardRef } from 'react';
import { FormGroup, IconViewSize } from '..';
import { MetaInfo } from '@/types';
import Image from 'next/image';
import { Link } from '@/utils/navigation';

type InputLinkProps = Omit<
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
  metaInfo?: MetaInfo;

  error?: string;
  size?: 'large' | 'middle' | 'small';
  layout?: 'horizontal' | 'vertical';
};

export const InputLinkForm = forwardRef(function Input(
  props: InputLinkProps,
  ref: Ref<HTMLInputElement>
) {
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
    metaInfo,
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
          'input-custom box-border flex w-full items-center border border-solid transition-all ease-linear hover:border-info bg-white',
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

      {/* Preview */}
      {metaInfo && Object.keys(metaInfo).length > 0 && (
        <div className="w-full bg-dark rounded-3xl p-4 mt-3 flex items-center flex-col gap-4 sm:flex-row-reverse justify-between">
          <div className="flex items-center gap-3">
            {metaInfo.imageUrl && (
              <Image
                width={128}
                height={80}
                loading="lazy"
                alt="meta-image"
                className="rounded-xl min-w-32"
                src={metaInfo.imageUrl}
              />
            )}

            <Link
              target="_blank"
              href={metaInfo.url ?? metaInfo.originUrl}
              className="w-fit block cursor-pointer text-text-tertiary"
            >
              <RenderIcon name="export-icon" />
            </Link>
          </div>

          <p className="text-sm text-white font-medium line-clamp-2">{metaInfo.description}</p>
        </div>
      )}
    </FormGroup>
  );
});
