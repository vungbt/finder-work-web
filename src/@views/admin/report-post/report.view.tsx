'use client';

import { AdminReportPostColumns } from '@/@handles/report-post/report-post-columns';
import { AdminReportPostUtils } from '@/@handles/report-post/report-post-utils';
import { ReportPostStatus } from '@/configs/graphql/generated';
import { FunctionBar, ModalConfirm, Pagination, Table } from '@/libraries/common';
import { useTranslations } from 'next-intl';

export function AdminReportPostView() {
  const {
    data,
    pagination,
    metadata,
    loading,
    sortActives,
    dataUpdate,
    loadingChange,
    setSearchValue,
    setPagination,
    onSort,
    onChangeStatus,
    onCloseModalConfirmChange,
    onConfirmChange
  } = AdminReportPostUtils();
  const t = useTranslations();

  return (
    <div>
      <FunctionBar
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
        tableId="ReportPostManagement"
        rows={data}
        columns={AdminReportPostColumns({ onSort, sortActives, onChangeStatus })}
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
        <ModalConfirm
          message={
            dataUpdate?.status === ReportPostStatus.Resolve
              ? t('noti.changeStatusToUnsolvedConfirm')
              : t('noti.changeStatusToSolvedConfirm')
          }
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
