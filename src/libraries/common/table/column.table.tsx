import React from 'react';
import { TableColumn } from './table';

type ColumnTableProps<T> = {
  row: T;
  render: TableColumn<T>['render'];
  index: number;
  rowIndex: number;
};
export function ColumnTable<T>({ row, render, rowIndex }: ColumnTableProps<T>) {
  const renderCell = () => {
    if (typeof render === 'string') {
      return <>{row[render] as string}</>;
    }
    return render(row, rowIndex);
  };

  return (
    <td className="px-4 py-2 text-left border-b border-solid border-gray-100 break-words">
      {renderCell()}
    </td>
  );
}
