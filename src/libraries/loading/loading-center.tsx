import React from 'react';
import { RenderIcon } from '../icons';
import clsx from 'clsx';

type LoadingCenterProps = {
  type?: 'loading' | 'loading-v2';
  className?: string;
};
export function LoadingCenter({ type = 'loading', className }: LoadingCenterProps) {
  return (
    <div className={clsx('w-full flex items-center justify-center', className)}>
      <RenderIcon name={type} />
    </div>
  );
}
