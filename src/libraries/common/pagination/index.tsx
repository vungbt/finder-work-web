import { PAGINATION } from '@/constants/common';
import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import ReactPaginate from 'react-paginate';

type PaginationProps = {
  onChangePage: (page: number) => void;
  className?: string;
  total: number;
  currentPage?: number;
  limit?: number;
};

export const Pagination = ({
  onChangePage,
  className,
  total,
  currentPage = PAGINATION.page,
  limit = PAGINATION.limit
}: PaginationProps) => {
  const renderItemPageFL = (isNext: boolean = true) => {
    return (
      <div className={clsx('page-item flex text-sm py-4 items-center')}>
        <RenderIcon
          strokeWidth={2}
          name={isNext ? 'chevron-right' : 'chevron-left'}
          className="!w-4 !h-4 mb-[2px]"
        />
      </div>
    );
  };
  const renderItemPage = (page: number) => {
    return (
      <div className={clsx('page-item selected-page flex text-sm sm:py-4 items-center')}>
        {page}
      </div>
    );
  };

  return (
    <ReactPaginate
      breakLabel="..."
      className={clsx(className, 'pagination-container')}
      nextLabel={renderItemPageFL()}
      previousLabel={renderItemPageFL(false)}
      pageLabelBuilder={(page: number) => renderItemPage(page)}
      pageRangeDisplayed={5}
      forcePage={currentPage && currentPage - 1}
      pageCount={Math.ceil(total / limit)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPageChange={(event: any) => {
        if (event.nextSelectedPage === undefined) return;
        onChangePage(event.nextSelectedPage);
      }}
      renderOnZeroPageCount={null}
    />
  );
};
