import React from 'react';
import { RenderIcon } from '../icons';
import clsx from 'clsx';

type LoadingOverlayProps = {
  type?: 'loading' | 'loading-v2';
  className?: string;
};
export function LoadingOverlay({ type = 'loading', className }: LoadingOverlayProps) {
  return (
    <div
      className={clsx(
        'absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center',
        className
      )}
    >
      <RenderIcon name={type} />
    </div>
  );
}
