import { ReportPost, SortOrder } from '@/configs/graphql/generated';
import { FallbackImage } from '@/constants/common';
import { RouterPath } from '@/constants/router-path';
import { ActionsTable, TableColumn } from '@/libraries/common';
import { SortCell } from '@/libraries/common/table/sort-cell';
import { getFullName } from '@/utils/helpers/common';
import { formatDate } from '@/utils/helpers/formatter';
import { useRouter } from '@/utils/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const AdminReportPostColumns = ({
  sortActives,
  onSort,
  onChangeStatus
}: {
  sortActives: Record<string, SortOrder>[];
  onSort?: (values: Record<string, SortOrder>[]) => void;
  onChangeStatus: (item: ReportPost) => void;
}): TableColumn<ReportPost>[] => {
  const t = useTranslations();

  const router = useRouter();

  const onGoToDetail = (row: ReportPost) => {
    if (!row.post?.slug) return;
    router.push(`${RouterPath.ADMIN_CAREERS_READ}/${row.post.slug}`);
  };

  return [
    {
      title: t('no'),
      render: (_: unknown, index: number): JSX.Element => <span>{index + 1}</span>,
      width: '20%'
    },
    {
      title: t('user'),
      render: (item: ReportPost): JSX.Element => (
        <div className="flex items-center gap-2">
          <Image
            src={item.user?.avatarUrl ?? FallbackImage.avatarUrl}
            alt={`${item.user?.firstName}'s avatar`}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm line-clamp-1">{getFullName(item.user ?? undefined)}</span>
        </div>
      )
    },
    {
      title: t('reason'),
      width: '20%',
      render: (row: ReportPost): JSX.Element => <p>{t(`reason.${row.reason}`)}</p>
    },
    {
      title: t('message'),
      width: '20%',
      render: (row: ReportPost): JSX.Element => <div>{row.message}</div>
    },
    {
      title: t('post'),
      width: '30%',
      render: (row: ReportPost): JSX.Element => (
        <div className="cursor-pointer">
          <p
            onClick={() => onGoToDetail(row)}
            className="underline transition-all ease-linear hover:text-info"
          >
            {`#${row.post.slug}`}
          </p>
        </div>
      )
    },

    {
      title: (
        <SortCell
          sortType="createdAt"
          title={t('createdAt')}
          actives={sortActives}
          onSortHandler={(values) => onSort && onSort(values)}
        />
      ),
      render: (item: ReportPost): JSX.Element => <>{formatDate(item.createdAt)}</>
    },
    {
      title: t('common.status'),
      render: (row: ReportPost) => (
        <ActionsTable onChangeStatus={() => onChangeStatus(row)} status={row.status} />
      )
    }
  ];
};
