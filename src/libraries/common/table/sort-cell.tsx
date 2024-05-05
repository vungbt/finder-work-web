import { SortOrder } from '@/configs/graphql/generated';
import { RenderIcon } from '@/libraries/icons';
import clsx from 'clsx';
import React, { useMemo } from 'react';

type SortCellProps = {
  title: string;
  sortType: string; // field to query
  actives?: Record<string, SortOrder>[];
  onSort?: (value: SortOrder, metadata?: { current?: SortOrder; sortType: string }) => void;
  onSortHandler?: (
    currentActives: Record<string, SortOrder>[],
    metadata?: { current?: SortOrder; sortType: string }
  ) => void; // use in case when get current list sort to match with prisma filter
};

export function SortCell({ title, actives = [], sortType, onSort, onSortHandler }: SortCellProps) {
  // get active sort
  const active = useMemo(
    () => actives && actives.find((item) => item[`${sortType}`])?.[`${sortType}`],
    [sortType, actives]
  );

  const sortValue = useMemo(
    () => (active ? (active === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc) : SortOrder.Desc),
    [active]
  );

  const onHandler = () => {
    if (onSort) {
      onSort && onSort(sortValue, { current: sortValue, sortType });
    }
    if (onSortHandler) {
      const currentSortActives = sortHandler(actives, sortValue, sortType);
      onSortHandler(currentSortActives, { current: sortValue, sortType });
    }
  };
  return (
    <div className="flex items-center justify-between">
      {title}
      <div className="flex items-center justify-center flex-col cursor-pointer" onClick={onHandler}>
        <RenderIcon
          style={{ marginBottom: '-2px' }}
          name="caret-up-solid"
          className={clsx('!w-3 !h-3', {
            'text-info': active === SortOrder.Asc
          })}
        />
        <RenderIcon
          style={{ marginTop: '-2px' }}
          name="caret-down-solid"
          className={clsx('!w-3 !h-3', {
            'text-info': active === SortOrder.Desc
          })}
        />
      </div>
    </div>
  );
}

export const sortHandler = (
  sortActions: Record<string, SortOrder>[],
  value: SortOrder,
  key: string
) => {
  const newSortActive = [...sortActions];
  const sortItemIndex = newSortActive.findIndex((item) => item[`${key}`]);
  if (sortItemIndex === -1) {
    newSortActive.push({ [key]: value });
  } else {
    const newItem = { ...newSortActive[sortItemIndex], [key]: value };

    if (value === SortOrder.Desc) {
      newSortActive.splice(sortItemIndex, 1);
    } else {
      newSortActive.splice(sortItemIndex, 1, newItem);
    }
  }
  return newSortActive;
};
