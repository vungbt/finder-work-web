import { PAGINATION } from '@/constants/common';
import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import React, { useMemo } from 'react';

type PaginationProps = {
  onChangePage: (page: number) => void;
  className?: string;
  total: number;
  currentPage?: number;
  limit?: number;
};

export function PaginationTop({
  onChangePage,
  className,
  total,
  currentPage = PAGINATION.page,
  limit = PAGINATION.limit
}: PaginationProps) {
  const totalPage = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const onHandleChange = (type: 'pre' | 'next') => {
    if ((type === 'pre' && currentPage === 1) || (type === 'next' && currentPage === totalPage))
      return;

    const newPage = type === 'pre' ? currentPage - 1 : currentPage + 1;
    onChangePage && onChangePage(newPage);
  };
  return (
    <div className={clsx('flex items-center justify-between w-fit gap-[2px]', className)}>
      <p className="text-sm font-medium">
        <span className="text-danger">{currentPage}</span>/{totalPage}
      </p>
      <button
        onClick={() => onHandleChange('pre')}
        disabled={currentPage === 1}
        className={clsx(
          'bg-gray-200 h-full min-h-8 min-w-8 flex items-center justify-center rounded transition-all ease-linear hover:bg-info hover:text-white ml-2',
          {
            'opacity-55 hover:bg-gray-200 hover:text-dark cursor-not-allowed': currentPage === 1
          }
        )}
      >
        <RenderIcon name="chevron-left" className="!w-5 !h-5" />
      </button>
      <button
        onClick={() => onHandleChange('next')}
        disabled={currentPage === totalPage}
        className={clsx(
          'bg-gray-200 h-full min-h-8 min-w-8 flex items-center justify-center rounded transition-all ease-linear hover:bg-info hover:text-white',
          {
            'opacity-55 hover:bg-gray-200 hover:text-dark cursor-not-allowed':
              currentPage === totalPage
          }
        )}
      >
        <RenderIcon name="chevron-right" className="!w-5 !h-5" />
      </button>
    </div>
  );
}
