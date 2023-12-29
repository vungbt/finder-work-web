import clsx from 'clsx';
import React, { Ref, forwardRef } from 'react';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string;
};

export const Button = forwardRef(function ButtonBase(
  props: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const { className, label, ...reset } = props;

  return (
    <button className={clsx(className, 'bg-gradient')} {...reset} ref={ref}>
      {label}
    </button>
  );
});
