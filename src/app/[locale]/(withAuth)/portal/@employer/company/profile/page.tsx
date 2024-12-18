'use client';

import { CompanyColumns } from '@/@handles/company/company-col';
import { CompanyUtils } from '@/@handles/company/company.ultis';
import { RouterPath } from '@/constants/router-path';
import { FunctionBar, ModalConfirm, Pagination, Table } from '@/libraries/common';
import { useTranslations } from 'next-intl';

export default function CompanyProfiles() {
  const {
    data,
    pagination,
    metadata,
    loading,
    itemDelete,
    sortActives,
    setPagination,
    onConfirmDelete,
    loadingDelete,
    onSort,
    onCloseModalConfirmDelete,
    onDelete
  } = CompanyUtils();

  const t = useTranslations();
  return (
    <div>
      <FunctionBar
        addUrl={RouterPath.COMPANY_PROFILE_DETAIL}
        // pagination top
        pagination={{
          total: metadata?.total ?? 0,
          limit: pagination.limit as number,
          currentPage: pagination.page
        }}
        onChangePage={(page) => setPagination({ ...pagination, page })}
      />

      <Table
        tableId="ReportPostManagement"
        rows={data}
        columns={CompanyColumns({ onSort, sortActives, onDelete })}
        loading={loading}
        className="mt-3"
      />

      {/* pagination */}
      <div className="flex justify-end mt-6">
        <Pagination
          total={metadata?.total ?? 0}
          limit={pagination.limit as number}
          currentPage={pagination.page}
          onChangePage={(page) => setPagination({ ...pagination, page })}
        />
      </div>
      <ModalConfirm
        message={t('noti.deleteConfirm', { label: t('item').toLowerCase() })}
        isOpen={!!itemDelete}
        isLoading={loadingDelete}
        onClose={onCloseModalConfirmDelete}
        onCancel={onCloseModalConfirmDelete}
        onSubmit={onConfirmDelete}
      />
    </div>
  );
}
