import { Setting, SortOrder } from '@/configs/graphql/generated';
import { FallbackImage } from '@/constants/common';
import { RouterPath } from '@/constants/router-path';
import { ActionsTable, TableColumn } from '@/libraries/common';
import { SortCell } from '@/libraries/common/table/sort-cell';
import { formatDate } from '@/utils/helpers/formatter';
import { Link, useRouter } from '@/utils/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const AdminGeneralColumns = ({
  onDelete,
  onSort,
  sortActives
}: {
  sortActives: Record<string, SortOrder>[];
  onDelete: (item: Setting) => void;
  onSort?: (values: Record<string, SortOrder>[]) => void;
}): TableColumn<Setting>[] => {
  const t = useTranslations();
  const router = useRouter();

  const onGoToDetail = (row: Setting) => {
    router.push(`${RouterPath.ADMIN_SETTING_GENERAL_ADD}?key=${row.key}&type=${row.type}`);
  };

  return [
    {
      title: t('no'),
      render: (_: unknown, index: number) => {
        return <span>{index + 1}</span>;
      },
      width: '20%'
    },
    {
      title: (
        <SortCell
          sortType="key"
          actives={sortActives}
          title={t('key')}
          onSortHandler={(values) => onSort && onSort(values)}
        />
      ),
      render: (row: Setting) => (
        <Link href={`${RouterPath.ADMIN_SETTING_GENERAL_ADD}?key=${row.key}&type=${row.type}`}>
          {row.key}
        </Link>
      )
    },
    {
      title: t('type'),
      render: 'type'
    },
    {
      title: t('author'),
      render: (item: Setting) => (
        <div className="flex items-center gap-2">
          <Image
            src={item?.author?.avatarUrl ?? FallbackImage.avatarUrl}
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm line-clamp-1">{item?.author?.firstName}</span>
        </div>
      )
    },
    {
      title: (
        <SortCell
          sortType="createdAt"
          actives={sortActives}
          title={t('createdAt')}
          onSortHandler={(values) => onSort && onSort(values)}
        />
      ),
      render: (item: Setting) => <>{formatDate(item.createdAt)}</>
    },
    {
      title: (
        <SortCell
          sortType="updatedAt"
          actives={sortActives}
          title={t('updatedAt')}
          onSortHandler={(values) => onSort && onSort(values)}
        />
      ),
      render: (item: Setting) => <>{formatDate(item.updatedAt)}</>
    },
    {
      title: t('actions'),
      render: (row) => (
        <ActionsTable onDelete={() => onDelete(row)} onGoToDetail={() => onGoToDetail(row)} />
      )
    }
  ];
};
