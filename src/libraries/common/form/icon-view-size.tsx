import { IconName, RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';

export const IconViewSize = ({
  name,
  isLoading,
  size,
  className
}: {
  name?: IconName;
  isLoading?: boolean;
  size: 'large' | 'middle' | 'small';
  className?: string;
}) => {
  return (
    <RenderIcon
      className={clsx(
        {
          '!h-5 !w-5 min-w-5': size === 'large',
          '!h-4.5 !w-4.5 min-w-4.5': size === 'middle',
          '!h-4 !w-4 min-w-4': size === 'small'
        },
        className
      )}
      name={isLoading ? 'loading' : name}
    />
  );
};
