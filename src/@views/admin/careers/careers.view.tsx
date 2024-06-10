'use client';

import { AdminCareerUtils } from '@/@handles/career';
import { RouterPath } from '@/constants/router-path';
import { FunctionBar, Pagination } from '@/libraries/common';
import { PostCard } from '@/libraries/common/cards';

export function CareersView() {
  const { data, pagination, metadata, setSearchValue, setPagination, onBookmark } =
    AdminCareerUtils();

  return (
    <div>
      <FunctionBar
        addUrl={RouterPath.ADMIN_CAREERS_ADD}
        onSearch={setSearchValue}
        // pagination top
        pagination={{
          total: metadata?.total ?? 0,
          limit: pagination.limit as number,
          currentPage: pagination.page
        }}
        onChangePage={(page) => setPagination({ ...pagination, page })}
      />

      <div className="mt-5 my-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 flex-wrap gap-6 justify-center">
        {data.map((item) => (
          <PostCard key={item.id} className="col-span-1" item={item} onBookmark={onBookmark} />
        ))}
      </div>

      {/* pagination */}
      <div className="flex justify-end mt-6">
        <Pagination
          total={metadata?.total ?? 0}
          limit={pagination.limit as number}
          currentPage={pagination.page}
          onChangePage={(page) => setPagination({ ...pagination, page })}
        />
      </div>
    </div>
  );
}
