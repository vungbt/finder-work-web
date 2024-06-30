'use client';
import { IconName, RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import React, { Ref, forwardRef, useMemo } from 'react';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string;
  iconName?: IconName;
  classNameIcon?: string;
  classNameWrap?: string;
  styleType?: 'avocado' | 'ketchup' | 'blue-cheese' | 'bun' | 'cabbage' | 'subtlest';
};

export const IconButton = forwardRef(function IconButton(
  props: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const { className, classNameIcon, iconName, classNameWrap, styleType, label, ...reset } = props;

  const styleString = useMemo(() => {
    if (!styleType) return '';
    switch (styleType) {
      case 'avocado':
        return 'action-avocado items-center flex gap-1 text-text-tertiary';
      case 'blue-cheese':
        return 'action-blue-cheese items-center flex gap-1 text-text-tertiary';
      case 'bun':
        return 'action-bun items-center flex gap-1 text-text-tertiary';
      case 'cabbage':
        return 'action-cabbage first-line:items-center items-center flex gap-1 text-text-tertiary';
      case 'ketchup':
        return 'action-ketchup items-center flex gap-1 text-text-tertiary';
      case 'subtlest':
        return 'action-subtlest first-line:items-center items-center flex gap-1 text-text-tertiary';
      default:
        return '';
    }
  }, [styleType]);

  return (
    <div className={clsx(classNameWrap, styleString)}>
      <button
        className={clsx(className, {
          "'block p-1'": !styleType,
          'p-[6px] rounded-lg': !!styleType
        })}
        type={reset.type ?? 'button'}
        {...reset}
        ref={ref}
      >
        <RenderIcon className={clsx('!w-5 !h-5', classNameIcon)} name={iconName} />
      </button>
      {label && <span className="font-medium">{label}</span>}
    </div>
  );
});
