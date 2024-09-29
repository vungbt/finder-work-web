import Loading from '@/libraries/icons/loading';
import clsx from 'clsx';
import isObject from 'lodash/isObject';
import { useMemo } from 'react';
import RowTable, { RowSelection } from './row.table';
import { Pagination } from '../pagination';

type ArrayElement<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never;

export type TableColumn<T> = {
  title: string | JSX.Element;
  className?: string;
  render: ((row: T, index: number) => JSX.Element) | Extract<keyof T, string>;
  width?: string | number;
  minWidth?: string | number;
  tableId?: string;
};

type TableScrollType = {
  y?: number;
  x?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableProps<T = any> = {
  rows: T[];
  columns: TableColumn<ArrayElement<TableProps<T>['rows']>>[];
  className?: string;

  total?: number;
  limit?: number;
  page?: number;
  loading?: boolean;
  rowSelection?: RowSelection<T>;
  scroll?: TableScrollType;
  tableId?: string;
  onChangePage?: (page: number) => void;
};

export function Table<T>(props: TableProps<T>) {
  const {
    columns,
    rows,
    loading,
    scroll,
    tableId,

    // pagination
    page,
    limit,
    total = 0,
    className,
    onChangePage,

    rowSelection
  } = props;

  const isSelected = useMemo(() => getSelectedAll(rowSelection, limit), [rowSelection, limit]);

  return (
    <div className={className}>
      <div className="overflow-auto">
        <table
          id={tableId}
          style={{
            width: scroll?.x
          }}
          className={clsx('table-auto border-collapse min-w-full text-sm')}
        >
          {/* table header */}
          <thead>
            <tr className="h-12 font-medium text-text-secondary">
              {/* row selection */}
              {rowSelection && (
                <RowSelection
                  id="all"
                  checked={isSelected.indeterminate ? undefined : isSelected.isSelected}
                  indeterminate={isSelected.indeterminate}
                  isHeader
                  type={rowSelection.type}
                  onClick={() =>
                    rowSelection.onSelectAll && rowSelection.onSelectAll(rowSelection.selectedRows)
                  }
                />
              )}
              {/* columns */}
              {columns.map((column, index) => (
                <td
                  key={index}
                  className="px-4 py-2 text-left border-b border-solid border-text-secondary tracking-wider break-words relative"
                >
                  {column.title}

                  {/* border */}
                  <div
                    style={{ transform: 'translate(0, -50%)' }}
                    className={clsx('absolute right-0 top-1/2 w-[1px] h-4 bg-text-secondary', {
                      hidden: index === columns.length - 1
                    })}
                  ></div>
                </td>
              ))}
            </tr>
          </thead>

          <tbody className="relative">
            {rows.map((record, recordIndex) => (
              <RowTable
                key={recordIndex}
                rowSelection={rowSelection}
                columns={columns}
                row={record}
                index={recordIndex}
              />
            ))}
            {/* loading */}
            {loading && (
              <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center w-full h-auto">
                <Loading />
              </div>
            )}
          </tbody>
        </table>
      </div>
      {onChangePage && (
        <Pagination
          className="mt-3 float-right"
          total={total}
          limit={limit}
          currentPage={page}
          onChangePage={(page) => onChangePage(page)}
        />
      )}
    </div>
  );
}

export function getSelectedAll<T>(rowSelection?: RowSelection<T>, pageSize?: number) {
  if (!rowSelection)
    return {
      isSelected: false,
      indeterminate: false
    };
  const { selectedRows } = rowSelection;
  const currentSelected =
    (isObject(selectedRows) ? Object.keys(selectedRows).length : selectedRows?.length) ?? 0;
  if (currentSelected === 0)
    return {
      isSelected: false
    };
  if (pageSize && currentSelected < pageSize)
    return {
      indeterminate: true
    };
  return {
    isSelected: true
  };
}
