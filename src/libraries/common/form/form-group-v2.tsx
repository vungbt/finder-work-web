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
export function FormGroupV2({
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
          'w-full gap-2',
          {
            'items-center': layout === 'horizontal',
            'flex-col items-start': layout === 'vertical'
          },
          className
        )}
      >
        {label && <FormLabel label={label} name={name ?? ''} isRequired={isRequired} />}
        <div className="w-full">{children}</div>
      </div>

      {/** error message */}
      {isShowError && name && (
        <ErrorMessage
          className="col-span-8 mt-1 w-full text-sm text-danger"
          name={name}
          component={'div'}
        />
      )}
    </div>
  );
}
