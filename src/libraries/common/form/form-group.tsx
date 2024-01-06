import clsx from 'clsx';
import { ErrorMessage } from 'formik';
import { ReactNode } from 'react';
import { FormLabel } from '.';

type FormGroupProps = {
  layout?: 'horizontal' | 'vertical';
  label?: string;
  name?: string;
  isRequired?: boolean;
  isShowError?: boolean;

  children: ReactNode;
  className?: string;
};
export function FormGroup({
  layout = 'vertical',
  isRequired = false,
  children,
  label,
  name,
  isShowError = true,
  className
}: FormGroupProps) {
  return (
    <div className="w-full">
      {/** main content */}
      <div
        className={clsx(
          'grid w-full grid-cols-12 gap-2',
          {
            'items-center': layout === 'horizontal',
            'items-start': layout === 'vertical'
          },
          className
        )}>
        {label && (
          <FormLabel
            className={clsx({
              'col-span-12': layout === 'vertical',
              'col-span-4 text-end': layout === 'horizontal'
            })}
            label={label}
            name={name ?? ''}
            isRequired={isRequired}
          />
        )}
        <div
          className={clsx('w-full', {
            'col-span-12': layout === 'vertical',
            'col-span-8': layout === 'horizontal'
          })}>
          {children}
        </div>
      </div>

      {/** error message */}
      {isShowError && name && (
        <div
          className={clsx('mt-1', {
            'grid grid-cols-12 gap-2': layout === 'horizontal'
          })}>
          <div
            className={clsx({
              hidden: layout === 'vertical',
              'col-span-4': layout === 'horizontal'
            })}
          />
          <ErrorMessage
            className="col-span-8 w-full text-sm text-danger"
            name={name}
            component={'div'}
          />
        </div>
      )}
    </div>
  );
}
