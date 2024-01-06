import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import React, { Ref, forwardRef } from 'react';

type SwitchProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'size'
> & {
  errorMes?: string;
  isLoading?: boolean;
  size?: 'large' | 'middle' | 'small';
};

export const Switch = forwardRef(function Switch(props: SwitchProps, ref: Ref<HTMLInputElement>) {
  const { className, errorMes, size = 'middle', isLoading, ...reset } = props;
  return (
    <label
      className={clsx('switch', 'relative inline-block', {
        'h-8 w-16': size === 'large',
        'h-6 w-11': size === 'middle',
        'h-4 w-7': size === 'small'
      })}
    >
      <input hidden ref={ref} type="checkbox" className="switch-input" {...reset} />

      <span
        className={clsx(
          'slider',
          {
            'switch-large': size === 'large',
            'switch-middle': size === 'middle',
            'switch-small': size === 'small'
          },
          className
        )}
      >
        <span
          className={clsx('slider-circle flex items-center justify-center', {
            'left-[3px] h-[26px] min-w-[26px]': size === 'large',
            'left-[2px] h-[18px] min-w-[18px]': size === 'middle',
            'left-[1px] h-3 min-w-3': size === 'small'
          })}
        >
          {isLoading && (
            <RenderIcon
              name="loading-v2"
              className={clsx(
                'switch-loading absolute rounded-full text-gray-100 transition-all duration-200 ease-linear',
                {
                  '!h-6 !w-6': size === 'large',
                  '!h-4 !w-4': size === 'middle',
                  '!h-[10px] !w-[10px]': size === 'small'
                }
              )}
            />
          )}
        </span>
      </span>

      {errorMes && <p className="mt-1 text-sm text-danger">{errorMes}</p>}
    </label>
  );
});
