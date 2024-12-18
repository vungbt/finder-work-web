'use client';
import { JobResultUtils } from '@/@handles/job/job-utils';
import { JobsResultUtils } from '@/@handles/job/jobs-ultils';
import { FunctionBar } from '@/libraries/common';
import { JobCard } from '@/libraries/common/cards/job.card';

export default function JobPortalPage() {
  const { data, setSearchValue, metadata, pagination, setPagination, goToDetails } =
    JobsResultUtils();
  const { mapSalaryRangeToLabel, mapJobTypeToLabel } = JobResultUtils();
  return (
    <div>
      <FunctionBar
        onSearch={setSearchValue}
        // pagination top
        pagination={{
          total: metadata?.total ?? 0,
          limit: metadata?.limit as number,
          currentPage: metadata?.page ?? undefined
        }}
        onChangePage={(page) => setPagination({ ...pagination, page })}
      />
      <div className="mt-5 my-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 flex-wrap gap-6 justify-center h-48 m-b-100">
        {data?.map((item) => (
          <JobCard
            key={item.id}
            item={item}
            className="col-span-1"
            goToDetails={goToDetails}
            mapSalary={mapSalaryRangeToLabel}
            mapJob={mapJobTypeToLabel}
          />
        ))}
      </div>
    </div>
  );
}
