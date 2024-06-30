import clsx from 'clsx';
import React from 'react';

type FormLabelProps = {
  label: string;
  name?: string;
  isRequired?: boolean;

  className?: string;
};
export function FormLabel({ isRequired = false, label, name, className }: FormLabelProps) {
  return (
    <label
      htmlFor={name}
      className={clsx(
        'form-label',
        {
          'form-label__required': isRequired
        },
        className
      )}
    >
      {label}
    </label>
  );
}
