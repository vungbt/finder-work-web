import clsx from 'clsx';
import React from 'react';

type DividerProps = {
  className?: string;
  label?: string;
};

export function Divider({ className, label }: DividerProps) {
  return (
    <div className={clsx(className, 'w-full h-[1px] bg-gray-100 relative')}>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-text-secondary bg-gray-200 block w-fit px-3">
        {label}
      </span>
    </div>
  );
}
