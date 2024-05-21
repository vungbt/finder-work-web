/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOptItem } from '@/types';
import clsx from 'clsx';
import { ErrorMessage, FieldInputProps, FormikProps } from 'formik';
import { cloneDeep } from 'lodash';
import { ChangeEvent } from 'react';
import { CheckboxItem } from '.';

type CheckboxGroupProps = {
  field?: FieldInputProps<never>;
  form?: FormikProps<any>;

  options: IOptItem[];
  layout?: 'horizontal' | 'vertical';
  styleType?: 'default' | 'danger' | 'info';
  size?: 'large' | 'middle' | 'small';
  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const CheckboxGroup = ({
  field,
  form,
  options = [],
  className,
  layout = 'horizontal',
  styleType,
  size = 'large',
  onChange
}: CheckboxGroupProps) => {
  const name = field?.name;
  const isHaveError = !form || !name ? false : form.errors[name] && form.touched[name];

  const onHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
    if (!field) return;
    const selectedValues = (cloneDeep(field.value) ?? []) as string[];
    const currentValue = event.target.value;
    const indexItemValid = selectedValues.findIndex((item) => item === currentValue);
    if (indexItemValid === -1) {
      selectedValues.push(currentValue);
    } else {
      selectedValues.splice(indexItemValid, 1);
    }
    const changeEvent = {
      target: {
        name,
        value: selectedValues
      }
    };
    field.onChange(changeEvent);
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
        )}
      >
        {options.map((item) => (
          <CheckboxItem
            key={item.value}
            name={name}
            id={name}
            checked={((field?.value ?? []) as string[]).includes(item.value)}
            onBlur={field?.onBlur}
            onChange={onHandleChange}
            value={item.value}
            label={item.label}
            styleType={styleType}
            size={size}
            isHaveError={!!isHaveError}
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
