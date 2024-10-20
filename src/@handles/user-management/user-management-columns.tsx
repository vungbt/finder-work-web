import { SortOrder, User } from '@/configs/graphql/generated';
import { FallbackImage } from '@/constants/common';
import { ActionsTable, TableColumn } from '@/libraries/common';
import { SortCell } from '@/libraries/common/table/sort-cell';
import { formatDate } from '@/utils/helpers/formatter';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const AdminUserUManagementColumns = ({
  onSort,
  sortActives,
  onChangeStatus
}: {
  sortActives: Record<string, SortOrder>[];
  onSort?: (values: Record<string, SortOrder>[]) => void;
  onChangeStatus: (item: User) => void;
}): TableColumn<User>[] => {
  const t = useTranslations();
  return [
    {
      title: t('no'),
      render: (_: unknown, index: number): JSX.Element => <span>{index + 1}</span>,
      width: '20%'
    },
    {
      title: t('name'),
      render: (row: User): JSX.Element => <div>{row.lastName}</div>
    },
    {
      title: t('user'),
      render: (item: User): JSX.Element => (
        <div className="flex items-center gap-2">
          <Image
            src={item.avatarUrl ?? FallbackImage.avatarUrl}
            alt={`${item.firstName}'s avatar`}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm line-clamp-1">{item.firstName}</span>
        </div>
      )
    },
    {
      title: t('form.email'),
      render: (item: User): JSX.Element => <>{item.email}</>
    },
    {
      title: t('form.phoneNumber'),
      render: (item: User): JSX.Element => <>{item.phoneNumber}</>
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
      render: (item: User): JSX.Element => <>{formatDate(item.createdAt)}</>
    },

    {
      title: t('status'),
      render: (item: User): JSX.Element => <>{item.status}</>
    },
    {
      title: t('actions'),
      render: (row) => <ActionsTable onChangeStatus={() => onChangeStatus(row)} />
    }
  ];
};
