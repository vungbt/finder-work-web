import { Company, SortOrder } from '@/configs/graphql/generated';
import { FallbackImage } from '@/constants/common';
import { RouterPath } from '@/constants/router-path';
import { ActionsTable, TableColumn } from '@/libraries/common';
import { SortCell } from '@/libraries/common/table/sort-cell';
import { formatDate } from '@/utils/helpers/formatter';
import { useRouter } from '@/utils/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const CompanyColumns = ({
  sortActives,
  onSort,
  onDelete
}: {
  sortActives: Record<string, SortOrder>[];
  onSort?: (values: Record<string, SortOrder>[]) => void;
  onDelete: (item: Company) => void;
}): TableColumn<Company>[] => {
  const t = useTranslations();

  const router = useRouter();

  const onGoToDetail = (row: Company) => {
    if (!row.id) return;
    router.push(`${RouterPath.COMPANY_PROFILE_DETAIL}/${row.id}`);
  };

  return [
    {
      title: t('no'),
      render: (_: unknown, index: number): JSX.Element => <span>{index + 1}</span>,
      width: '20%'
    },
    {
      title: t('common.avatar'),
      render: (item: Company): JSX.Element => (
        <div className="flex items-center gap-2">
          <Image
            src={item.avatar?.url ?? FallbackImage.avatarUrl}
            alt={`${item.name}'s avatar`}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm line-clamp-1">{item.name}</span>
        </div>
      )
    },
    {
      title: t('common.size'),
      width: '20%',
      render: (row: Company): JSX.Element => <p>{row.size?.key}</p>
    },
    {
      title: t('type'),
      width: '20%',
      render: (row: Company): JSX.Element => <p>{row.type?.key}</p>
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
      render: (item: Company): JSX.Element => <>{formatDate(item.createdAt)}</>
    },
    {
      title: t('action'),
      render: (row: Company) => (
        <ActionsTable onGoToDetail={() => onGoToDetail(row)} onDelete={() => onDelete(row)} />
      )
    }
  ];
};
