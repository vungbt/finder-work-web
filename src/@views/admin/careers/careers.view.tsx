'use client';

import { AdminCareerUtils } from '@/@handles/career';
import { RouterPath } from '@/constants/router-path';
import { FunctionBar, Pagination } from '@/libraries/common';
import { PostCard } from '@/libraries/common/cards';

export function CareersView() {
  const { data, pagination, setSearchValue, setPagination } = AdminCareerUtils();
  return (
    <div>
      <FunctionBar addUrl={RouterPath.ADMIN_CAREERS_ADD} onSearch={setSearchValue} />

      <div className="mt-5 my-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 flex-wrap gap-6 justify-center">
        {data.map((item) => (
          <PostCard key={item.id} className="col-span-1" item={item} />
        ))}
      </div>

      {/* pagination */}
      <div className="flex justify-end">
        <Pagination
          total={10}
          limit={pagination.limit as number}
          onChangePage={(page) => setPagination({ ...pagination, page })}
        />
      </div>
    </div>
  );
}
