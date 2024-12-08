import { Job, SortOrder } from '@/configs/graphql/generated';
import { RouterPath } from '@/constants/router-path';
import { ActionsTable, TableColumn } from '@/libraries/common';
import { SortCell } from '@/libraries/common/table/sort-cell';
import { formatDate } from '@/utils/helpers/formatter';
import { useRouter } from '@/utils/navigation';
import { useTranslations } from 'next-intl';
import { JobResultUtils } from './job-utils';

export const JobColumns = ({
  sortActives,
  onSort,
  onDelete
}: {
  sortActives: Record<string, SortOrder>[];
  onSort?: (values: Record<string, SortOrder>[]) => void;
  onDelete: (item: Job) => void;
}): TableColumn<Job>[] => {
  const t = useTranslations();
  const { mapJobTypeToLabel, mapJobLevelToLabel } = JobResultUtils();
  const router = useRouter();

  const onGoToDetail = (row: Job) => {
    if (!row.id) return;
    router.push(`${RouterPath.JOB_DETAIL}/${row.id}`);
  };

  return [
    {
      title: t('no'),
      render: (_: unknown, index: number): JSX.Element => <span>{index + 1}</span>,
      width: '20%'
    },

    {
      title: t('common.jobTitle'),
      width: '20%',
      render: (row: Job): JSX.Element => <p>{row.jobTitle?.name}</p>
    },
    {
      title: t('type'),
      width: '20%',
      render: (row: Job): JSX.Element => <p>{mapJobTypeToLabel(row.type)}</p>
    },
    {
      title: t('common.numberOfRecruits'),
      width: '20%',
      render: (row: Job): JSX.Element => <p>{row.numberOfRecruits}</p>
    },
    {
      title: t('common.address'),
      width: '20%',
      render: (row: Job): JSX.Element => <p>{row.address?.name}</p>
    },
    {
      title: t('common.deadline'),
      width: '20%',
      render: (row: Job): JSX.Element => <p>{formatDate(row.applicationDeadline)}</p>
    },
    {
      title: t('common.company'),
      width: '20%',
      render: (row: Job): JSX.Element => <p>{formatDate(row.applicationDeadline)}</p>
    },
    {
      title: t('common.level'),
      width: '20%',
      render: (row: Job): JSX.Element => <p>{mapJobLevelToLabel(row.level)}</p>
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
      render: (item: Job): JSX.Element => <>{formatDate(item.createdAt)}</>
    },
    {
      title: t('actions'),
      render: (row: Job) => (
        <ActionsTable onGoToDetail={() => onGoToDetail(row)} onDelete={() => onDelete(row)} />
      )
    }
  ];
};
