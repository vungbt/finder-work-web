/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconName } from '@/libraries/icons';
import clsx from 'clsx';
import { ErrorMessage, FieldInputProps, FormikProps } from 'formik';
import { ChangeEvent, Ref, forwardRef, useState } from 'react';
import { FormGroup, IconViewSize } from '..';
import { useTranslations } from 'next-intl';
import { countCharacters, countWords } from '@/utils/helpers/common';

type TextareaProps = Omit<
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
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
  characters?: number;
  words?: number;
  excludeWhitespace?: boolean;

  error?: string;
  size?: 'large' | 'middle' | 'small';
  layout?: 'horizontal' | 'vertical';
};

export const TextareaForm = forwardRef(function Textarea(
  props: TextareaProps,
  ref: Ref<HTMLTextAreaElement>
) {
  const t = useTranslations();
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
    characters = 300,
    words,
    excludeWhitespace = false,
    onChange,
    ...reset
  } = props;
  const name = field?.name;
  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];
  const [count, setCount] = useState<number>(0);

  const onHandleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    const value = e.target.value;
    if (characters && characters > 0) {
      const characterCount = countCharacters(value, excludeWhitespace);
      if (characterCount > characters) return;
      setCount(characterCount);
    } else if (words && words > 0) {
      const wordCount = countWords(value);
      if (wordCount > words) return;
      setCount(wordCount);
    }
    if (onChange) {
      onChange(e);
    }
    field?.onChange(e);
  };

  return (
    <FormGroup
      size={size}
      layout={layout}
      label={label}
      name={name}
      isShowError={false}
      isRequired={isRequired}
    >
      <label
        htmlFor={name}
        className={clsx(
          'input-custom box-border flex w-full items-center border border-solid transition-all ease-linear hover:border-info bg-white resize-none',
          {
            'min-h-10 gap-3 rounded-3xl px-4 py-4 text-base': size === 'large',
            'min-h-8 gap-2 rounded-2xl px-4 py-4 text-sm': size === 'middle',
            'min-h-6 gap-1 rounded-xl px-2 py-2 text-sm': size === 'small',

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
        <textarea
          ref={ref}
          name={name}
          id={name}
          value={field?.value}
          onChange={onHandleChange}
          onBlur={field?.onBlur}
          disabled={disabled}
          className={clsx(
            'w-full flex-1 border-none text-dark outline-none bg-transparent',
            { 'cursor-not-allowed bg-gray-100': disabled },
            className
          )}
          rows={reset.rows ?? 3}
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

      <div className="mt-1 flex w-full items-center justify-between">
        {/* error */}
        {name && (
          <div
            className={clsx('', {
              'grid grid-cols-12 gap-2': layout === 'horizontal'
            })}
          >
            <div
              className={clsx({
                hidden: layout === 'vertical',
                'col-span-4': layout === 'horizontal'
              })}
            />
            <ErrorMessage
              className={clsx('col-span-8 w-full text-danger', {
                'text-sm': size === 'large',
                'text-xs': size === 'middle' || size === 'small'
              })}
              name={name}
              component={'div'}
            />
          </div>
        )}
        {(characters || words) && (
          <p className="text-right text-sm text-dark opacity-40">
            {t('selecting.charCount', {
              type: characters && characters > 0 ? 'char' : 'word',
              max: characters || words,
              count: count
            })}
          </p>
        )}
      </div>
    </FormGroup>
  );
});
