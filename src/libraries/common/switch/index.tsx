import clsx from 'clsx';
import React, { Ref, forwardRef } from 'react';

type SwitchProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'size'
> & {
  errorMes?: string;
  size?: 'large' | 'middle' | 'small';
};

export const Switch = forwardRef(function Switch(props: SwitchProps, ref: Ref<HTMLInputElement>) {
  const { className, errorMes, size = 'middle', ...reset } = props;
  return (
    <label
      className={clsx('switch', 'relative inline-block', {
        'h-8 w-16': size === 'large',
        'h-6 w-11': size === 'middle',
        'h-4 w-7': size === 'small'
      })}>
      <input hidden ref={ref} type="checkbox" className="switch-input" {...reset} />

      <span
        className={clsx(
          'slider',
          {
            'switch-large before:left-[3px] before:h-[26px] before:min-w-[26px]': size === 'large',
            'switch-middle before:left-[2px] before:h-[18px] before:min-w-[18px]':
              size === 'middle',
            'switch-small before:left-[1px] before:h-3 before:min-w-3': size === 'small'
          },
          className
        )}></span>
      {errorMes && <p className="mt-1 text-sm text-danger">{errorMes}</p>}
    </label>
  );
});
