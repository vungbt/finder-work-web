'use client';

import { AdminUserManagementUtils } from '@/@handles/user-management/user-management.utils';
import { AdminUserUManagementColumns } from '@/@handles/user-management/user-management-columns';
import { FunctionBar, ModalConfirm, Pagination, Table } from '@/libraries/common';
import { keyBy } from 'lodash';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function UserManagementView() {
  const {
    data,
    pagination,
    metadata,
    setSearchValue,
    setPagination,
    loading,
    onSort,
    sortActives,
    onChangeStatus,
    loadingChange,
    onConfirmChange,
    onCloseModalConfirmChange,
    dataUpdate
  } = AdminUserManagementUtils();
  const [selectedRows, setSelectedRows] = useState<any>({});
  const t = useTranslations();
  return (
    <div>
      <FunctionBar
        // addUrl={RouterPath.ADMIN_CAREERS_ADD}
        onSearch={setSearchValue}
        // pagination top
        pagination={{
          total: metadata?.total ?? 0,
          limit: pagination.limit as number,
          currentPage: pagination.page
        }}
        onChangePage={(page) => setPagination({ ...pagination, page })}
      />

      <Table
        tableId="UserManagement"
        rows={data}
        columns={AdminUserUManagementColumns({ onSort, sortActives, onChangeStatus })}
        loading={loading}
        className="mt-3"
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
      />

      {/* pagination */}
      <div className="flex justify-end mt-6">
        <Pagination
          total={metadata?.total ?? 0}
          limit={pagination.limit as number}
          currentPage={pagination.page}
          onChangePage={(page) => setPagination({ ...pagination, page })}
        />
        <ModalConfirm
          message={t('noti.changeStatusConfirm', { label: t('setting').toLowerCase() })}
          isOpen={!!dataUpdate}
          isLoading={loadingChange}
          onClose={onCloseModalConfirmChange}
          onCancel={onCloseModalConfirmChange}
          onSubmit={onConfirmChange}
          submitIcon={'danger'}
        />
      </div>
    </div>
  );
}
