'use client';
import { Button, Table, TableColumn } from '@/libraries/common';
import keyBy from 'lodash/keyBy';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function PortalAdmin() {
  const renderColumns = (): TableColumn<{
    id: number;
    name: string;
    age: number;
    color: string;
    phone: string;
    category: string;
    address: string;
  }>[] => {
    return [
      {
        title: 'No',
        render: (_: unknown, index: number) => {
          return <span>{index + 1}</span>;
        },
        width: '20%'
      },
      {
        title: 'Name',
        render: 'name'
      },
      {
        title: 'Age',
        render: 'age'
      },
      {
        title: 'Color',
        render: 'color'
      },
      // {
      //   title: 'Category',
      //   render: 'category'
      // },
      {
        title: 'Address',
        render: 'address'
      },
      {
        title: 'Phone',
        render: 'phone'
      }
    ];
  };

  const data = [2, 2, 2, 2, 2, 2, 2, 22, 2, 2].map((_, index) => ({
    id: index,
    name: 'Alice',
    age: 25,
    phone: '0383007243',
    category: 'Developer',
    color: 'Sliver',
    address: 'Xom 10, Giao Ha, Giao Thuy'
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRows, setSelectedRows] = useState<any>({});

  return (
    <div>
      Portal Admin
      <Button label="Sign out" onClick={() => signOut()} />
      <Table
        tableId="testTable"
        columns={renderColumns()}
        rows={data}
        page={1}
        limit={10}
        total={100}
        rowSelection={{
          type: 'checkbox',
          selectedRows,
          onSelectAll: () => {
            const newData = { ...selectedRows };
            if (Object.keys(newData).length >= 10) {
              setSelectedRows({});
            } else {
              setSelectedRows(keyBy(data, 'id'));
            }
          },
          onSelect: (row) => {
            const newData = { ...selectedRows };
            const item = newData[row?.id];
            if (!item || Object.keys(item).length <= 0) {
              newData[row?.id] = { ...row };
            } else {
              delete newData[item.id];
            }
            setSelectedRows(newData);
          }
        }}
        onChangePage={(page) => console.log('page====>', page)}
      />
      {/* 
      <PostCard item={

      } /> */}
    </div>
  );
}
