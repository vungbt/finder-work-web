import clsx from 'clsx';
import find from 'lodash/find';
import isObject from 'lodash/isObject';
import { useMemo } from 'react';
import { CheckboxItem } from '../checkbox';
import { RadioItem } from '../radio';
import { ColumnTable } from './column.table';
import { TableColumn } from './table';

export type RowSelection<T> = {
  type: 'checkbox' | 'radio';
  selectedRows?: T[] | Extract<keyof T, string>;
  selectedRowKey?: string;
  onSelect?: (record: T, selectedRows?: T[] | Extract<keyof T, string>) => void;
  onSelectAll?: (selectedRows?: T[] | Extract<keyof T, string>) => void;
};

export type RowTableProps<T> = {
  row: T;
  columns: TableColumn<T>[];
  index: number;
  className?: string;
  rowSelection?: RowSelection<T>;
};

type RowSelectionRender = {
  id?: string;
  type: 'checkbox' | 'radio';
  checked?: boolean;
  indeterminate?: boolean;
  isHeader?: boolean;
  onClick: () => void;
};

export default function RowTable<T>(props: RowTableProps<T>) {
  const { row, columns, index, className, rowSelection } = props;

  const onHandleClickRowSelection = () => {
    if (!rowSelection) return;
    const { onSelect, selectedRows } = rowSelection;
    onSelect && onSelect(row, selectedRows);
  };

  const isSelected = useMemo(() => getSelected(row, rowSelection), [row, rowSelection]);
  return (
    <tr
      className={clsx(className, 'h-12 hover:bg-gray transition-all ease-linear', {
        '!bg-tertiary': isSelected
      })}
    >
      {rowSelection && (
        <RowSelection
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id={(row as any)[rowSelection?.selectedRowKey ?? 'id']}
          checked={isSelected}
          type={rowSelection.type}
          onClick={onHandleClickRowSelection}
        />
      )}
      {columns.map((column, columnIndex) => (
        <ColumnTable<T>
          rowIndex={index}
          index={columnIndex}
          render={column.render}
          key={columnIndex}
          row={row}
        />
      ))}
    </tr>
  );
}

export function RowSelection(props: RowSelectionRender) {
  const { type, id, onClick, indeterminate, checked, isHeader } = props;

  switch (type) {
    case 'checkbox':
      return (
        <td
          className={clsx('px-4 py-2 text-left border-b border-solid tracking-wider break-words', {
            'border-text-tertiary': isHeader,
            'border-gray-100': !isHeader
          })}
        >
          <CheckboxItem
            id={id}
            name={id}
            size="small"
            styleType="info"
            onClick={onClick}
            checked={checked}
            indeterminate={indeterminate}
          />
        </td>
      );
    case 'radio':
      return (
        <td
          className={clsx('px-4 py-2 text-left border-b border-solid tracking-wider break-words', {
            'border-text-tertiary': isHeader,
            'border-gray-100': !isHeader
          })}
        >
          {!isHeader ? (
            <RadioItem
              id={id}
              name={id}
              size="small"
              styleType="info"
              checked={checked}
              onClick={onClick}
            />
          ) : null}
        </td>
      );
  }
}

export function getSelected<T>(row: T, rowSelection?: RowSelection<T>) {
  if (!rowSelection) return false;
  const { selectedRows, selectedRowKey } = rowSelection;
  let itemSelected = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const key = (row as any)[selectedRowKey ?? 'id'];
  if (!isObject(selectedRows)) {
    itemSelected = find(
      selectedRows,
      (selectedRow) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (selectedRow as any)[key] === key
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemSelected = (selectedRows as any)[key];
  }
  if (!itemSelected) return false;
  return true;
}
