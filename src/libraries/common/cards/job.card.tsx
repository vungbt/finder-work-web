import { Job } from '@/configs/graphql/generated';
import { FallbackImage } from '@/constants/common';
import { RenderIcon } from '@/libraries/icons';
import { Link } from '@/utils/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type JobCardProps = {
  item: Job;
  className?: string;
  goToDetails: (item: Job) => void;
  mapJob: (job: string) => string;
  mapSalary: (salary: string) => string;
};

export function JobCard({ item, className, goToDetails, mapSalary, mapJob }: JobCardProps) {
  const t = useTranslations();
  return (
    <article className={clsx('card min-h-56 rounded-2xl shadow-md bg-gray-200 w-full', className)}>
      <div className="justify-between h-56 w-full p-4 flex flex-col gap-3 relative z-[1] rounded-2xl shadow-md bg-gray-200">
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="w-fit h-fit block">
                <Image
                  width={56}
                  height={56}
                  alt="post-author"
                  src={item.company?.avatar?.url ?? FallbackImage.avatarUrl}
                  className="rounded-full"
                />
              </Link>
              <h2 className="font-medium text-sm">{item.company?.name}</h2>
            </div>
            <button className="p-[3px] rounded-lg" onClick={() => goToDetails && goToDetails(item)}>
              <RenderIcon name={'eye'} />
            </button>
          </div>

          <div className="flex flex-col items-start gap-3">
            <h3>{item.jobCategory?.name}</h3>
            <div>
              {item.address?.name} - {mapSalary(item.salary)}
            </div>
            <div>{mapJob(item.type)}</div>
          </div>
        </div>
      </div>
      {/* TODO: Implement flag hot */}
      {/* flag */}
      {item.isBoot && <div className="card__flag card__flag-hot">{t('common.hot')}</div>}
    </article>
  );
}
