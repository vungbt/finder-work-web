/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import { ErrorMessage, FieldInputProps, FormikProps } from 'formik';
import { ChangeEvent } from 'react';
import { RadioItem } from '.';
import { IOptItem } from '@/types';

type RadioGroupProps = {
  field?: FieldInputProps<never>;
  form?: FormikProps<any>;

  options: IOptItem[];
  layout?: 'horizontal' | 'vertical';
  styleType?: 'default' | 'danger' | 'info';
  size?: 'large' | 'middle' | 'small';

  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const RadioGroup = ({
  field,
  form,
  options = [],
  className,
  styleType,
  size = 'large',
  layout = 'horizontal',
  onChange
}: RadioGroupProps) => {
  const name = field?.name;
  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];

  const onHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
    if (!field) return;
    field.onChange(event);
  };

  return (
    <div>
      <div
        className={clsx(
          'flex',
          {
            'flex-row gap-6': layout === 'horizontal',
            'flex-col gap-4': layout === 'vertical'
          },
          className
        )}>
        {options.map((item) => (
          <RadioItem
            key={item.value}
            name={name}
            id={name}
            checked={field?.value === item.value}
            onBlur={field?.onBlur}
            onChange={onHandleChange}
            value={item.value}
            label={item.label}
            styleType={styleType}
            isHaveError={!!isHaveError}
            size={size}
          />
        ))}
      </div>
      {isHaveError && name && (
        <ErrorMessage
          className="col-span-8 mt-1 w-full text-sm text-danger"
          name={name}
          component={'div'}
        />
      )}
    </div>
  );
};
