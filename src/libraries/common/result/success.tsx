import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import { ReactNode, useMemo } from 'react';

type SuccessResultProps = {
  title: string;
  status?: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
  subTitle?: string;
  extra?: ReactNode;
  className?: string;
};

export function SuccessResult({
  status = 'success',
  title,
  subTitle,
  extra,
  className
}: SuccessResultProps) {
  const iconName = useMemo(() => {
    if (status === 'success') return 'success';
  }, [status]);
  return (
    <div className={clsx(className)}>
      <RenderIcon name={iconName} className="!w-40 !h-40 mx-auto" />
      <h3 className="font-semibold text-[32px] leading-[48px] mt-4 text-center">{title}</h3>
      {subTitle && subTitle.length > 0 && (
        <p className="text-center mt-4 text-base text-text-secondary">{subTitle}</p>
      )}
      {extra}
    </div>
  );
}
