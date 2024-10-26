import { Skill, SortOrder } from '@/configs/graphql/generated';
import { ActionsTable, TableColumn } from '@/libraries/common';
import { SortCell } from '@/libraries/common/table/sort-cell';
import { formatDate } from '@/utils/helpers/formatter';
import { useTranslations } from 'next-intl';

export const AdminSkillManagementColumns = ({
  onSort,
  sortActives,
  onDelete,
  onEdit
}: {
  sortActives: Record<string, SortOrder>[];
  onSort?: (values: Record<string, SortOrder>[]) => void;
  onDelete: (item: Skill) => void;
  onEdit: (item: Skill) => void;
}): TableColumn<Skill>[] => {
  const t = useTranslations();
  return [
    {
      title: t('no'),
      render: (_: unknown, index: number): JSX.Element => <span>{index + 1}</span>,
      width: '20%'
    },
    {
      title: t('content'),
      render: (row: Skill): JSX.Element => <div>{row.content}</div>
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
      render: (item: Skill): JSX.Element => <>{formatDate(item.createdAt)}</>
    },

    {
      title: t('actions'),
      render: (row: Skill) => (
        <ActionsTable
          onDelete={() => onDelete(row)}
          onGoToDetailSkill={() => onEdit(row)}
          item={row}
        />
      )
    }
  ];
};
